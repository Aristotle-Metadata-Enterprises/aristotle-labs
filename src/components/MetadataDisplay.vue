<template>
    <div>
        <svg class="metadata-display"
             ref="svg"
             :xmlns="svg_ns"
             width="100%"
             preserveAspectRatio="xMidYMid meet"
             >
            <g ref="inner" />
            <g ref="headings" class="headings">
                <text v-for="h in headings" :key="h.id" :id="h.id" :x="h.x" :y="h.y">{{ h.text }}</text>
            </g>
        </svg>
    </div>
</template>

<script>
import '@aristotle-metadata-enterprises/aristotle_tooltip/dist/tooltip.css'

import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

import { mapPush } from '@/utils/mapping.js'
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'

export default {
    data: () => ({
        // Padding between svg groups (headings and graph)
        groupPadding: 20,
        // Margin around graph headings
        headingMargin: 20,
        // svg namespace
        svg_ns: 'http://www.w3.org/2000/svg',
        // Heading objects
        headings: [
            {id: 'inputsHeading', text: 'Inputs', x: 0, y: 0},
            {id: 'transHeading', text: 'Transformations', x: 0, y: 0},
            {id: 'outputsHeading', text: 'Outputs', x: 0, y: 0},
        ]
    }),
    props: {
        // Dss graphql data
        dss: {
            type: Object,
            required: true,
        },
        // uuid's of selected elements to display in graph
        // Falsy elements will be ignored
        selected: {
            type: Array,
            default: () => [],
        },
        // Whether to display tooltips on hover of graph elements
        tooltips: {
            type: Boolean,
            default: false,
        }
    },
    mounted: function() {
        this.show()
    },
    computed: {
        // Construct maps representing graph, used to construct final filtered graph
        graph: function() {
            // Map of id to id of parents along with edge description
            let parents = new Map()
            // Map of node id's to node names and type
            let nodeInfo = new Map()

            if (Object.keys(this.dss).length > 0) {
                // Create root dss node
                nodeInfo.set(
                    this.dss.uuid,
                    {
                        id: this.dss.aristotleId,
                        name: this.dss.name,
                        type: 'Dataset Specification',
                    }
                )
                parents.set(this.dss.uuid, [])
                for (let inc of this.dss.dssdeinclusionSet) {
                    nodeInfo.set(
                        inc.dataElement.uuid,
                        {
                            id: inc.dataElement.aristotleId,
                            name: inc.dataElement.name,
                            displayName: inc.dataElement.dataElementConcept.property.name,
                            type: 'Data Element',
                        }
                    )
                    mapPush(
                        parents,
                        inc.dataElement.uuid,
                        {parent: this.dss.uuid, edgeLabel: 'inclusion'}
                    )
                    for (let input of inc.dataElement.dedinputsthroughSet) {
                        nodeInfo.set(
                            input.dataElementDerivation.uuid,
                            {
                                id: input.dataElementDerivation.aristotleId,
                                name: input.dataElementDerivation.name,
                                type: 'Data Element Derivation',
                            }
                        )
                        mapPush(
                            parents,
                            input.dataElementDerivation.uuid,
                            {parent: inc.dataElement.uuid, edgeLabel: 'input'}
                        )
                        for (let derive of input.dataElementDerivation.dedderivesthroughSet) {
                            nodeInfo.set(
                                derive.dataElement.uuid,
                                {
                                    id: derive.dataElement.aristotleId,
                                    name: derive.dataElement.name,
                                    displayName: derive.dataElement.dataElementConcept.property.name,
                                    type: 'Data Element',
                                }
                            )
                            mapPush(
                                parents,
                                derive.dataElement.uuid,
                                {parent: input.dataElementDerivation.uuid, edgeLabel: 'derives'}
                            )
                        }
                    }
                }
            }
            return {parents: parents, nodeInfo: nodeInfo}
        },
    },
    watch: {
        // Redraw graph when new elements selected
        selected: function() {
            this.show()
        }
    },
    methods: {
        // Render graph based on current selection
        show: function() {
            this.drawGraph(this.createDisplayGraph(this.selected))
        },
        // Get url for item
        getItemUrl: function(id) {
            return `https://registry.aristotlemetadata.com/item/${id}`
        },
        // Create svg element given tag name, optional object of attributes and optional text
        createSvgElement: function(tag, attrs, text) {
            let e = document.createElementNS(this.svg_ns, tag)
            if (attrs) {
                for (let [attr, value] of Object.entries(attrs)) {
                    e.setAttribute(attr, value)
                }
            }
            if (text) {
                e.appendChild(document.createTextNode(text))
            }
            return e
        },
        // Get a nodes label
        getNodeLabel: function(info) {
            let nameText = info.name
            if (info.displayName) {
                nameText = info.displayName
            }
            // Create 2 lines of text
            let name = this.createSvgElement('tspan', {class: 'title', dy: '1em', x: '1'}, nameText)
            let type = this.createSvgElement('tspan', {dy: '1em', x: '1'}, `(${info.type})`)

            // Add to text element
            let text = this.createSvgElement('text')
            text.appendChild(name)
            text.appendChild(type)
            return text
        },
        // Get the data to be associated with display graphs node
        // nodeInfo is object retrieve from graph
        // cls is optional name of html class to give node for styling
        getNodeData: function(nodeInfo, cls) {
            let data = {
                rx: 5,
                ry: 5,
                shape: 'rect',
                label: this.getNodeLabel(nodeInfo),
                labelType: 'svg',
                aristotleId: nodeInfo.id,
            }
            if (cls) {
                data.class = cls
            }
            return data
        },
        // Create dagre graph filtered to contain all paths to selected metadata
        createDisplayGraph: function(selected) {
            let dgraph = new dagreD3.graphlib.Graph()
            dgraph.setGraph({directed: true})
            let nodeStack = []

            // Start with selected values
            for (let val of selected) {
                // Ignore empty values
                if (val) {
                    if (this.graph.nodeInfo.has(val)) {
                        nodeStack.push(val)
                        let info = this.graph.nodeInfo.get(val)
                        dgraph.setNode(val, this.getNodeData(info, 'selected'))
                    } else {
                        console.error(`${val} is not a valid node`)
                    }
                }
            }

            // While there are nodes to process add parents to graph
            while (nodeStack.length > 0) {
                let uuid = nodeStack.pop()
                for (let parent of this.graph.parents.get(uuid)) {
                    let info = this.graph.nodeInfo.get(parent.parent)
                    dgraph.setNode(parent.parent, this.getNodeData(info))
                    dgraph.setEdge(parent.parent, uuid, {label: parent.edgeLabel})
                    nodeStack.push(parent.parent)
                }
            }

            return dgraph
        },
        // Initialise aristotle tooltips
        setupTooltips: function() {
            aristotleTooltip({
                selector: this.$refs.svg,
                interactive: false,
                definitionWords: 40,
                placement: 'top',
            })
        },
        // Move heading to correct positions above graph
        // Returns heading space
        positionHeadings: function() {
            let graphWidth = this.$refs.inner.getBBox().width

            let x = 0
            let increment = graphWidth / (this.headings.length - 1)
            for (let i = 0; i < this.headings.length; i++) {
                let h = this.headings[i]
                let element = document.getElementById(h.id)
                // Set position
                h.y = this.groupPadding
                if (i === 0) {
                    // Float left for first element
                    h.x = x + this.headingMargin
                } else if (i === (this.headings.length - 1)) {
                    // float right for last element
                    h.x = x - element.getComputedTextLength() - this.headingMargin
                } else {
                    // Center for middle elements
                    h.x = x - ((element.getComputedTextLength() + (2 * this.headingMargin)) / 2)
                }
                // Update x
                x += increment
            }
            // Calculate and return heading space
            let headingsHeight = this.$refs.headings.getBBox().height
            return headingsHeight + this.groupPadding;
        },
        // Position graph within svg
        positionGraph: function(headingSpace) {
            // Get bounding box for graph
            let graphBox = this.$refs.inner.getBBox()
            // Set height of graph
            let height = graphBox.height + headingSpace
            this.$refs.svg.setAttribute('height', height)

            // Position graph
            // Translate graph to give space for headings
            this.$refs.inner.setAttribute('transform', `translate(0, ${headingSpace})`)
        },
        // Wrap nodes in svg links
        wrapNodes: function(graph) {
            // Wrap node groups in links
            for (let node of this.$refs.svg.querySelectorAll('g.node')) {
                // Get d3 data associated with node
                let node_id = d3.select(node).datum();
                let data = graph.node(node_id)
                // Create link
                let link = this.createSvgElement('a', {
                    href: this.getItemUrl(data.aristotleId),
                    'data-aristotle-concept-id': data.aristotleId,
                    target: '_blank'
                })
                // Insert link before node
                node.parentNode.insertBefore(link, node)
                // Move node inside link
                link.appendChild(node)
            }
        },
        // Sets the viewbox for the whole svg
        setViewBox: function() {
            // Get bounding box for graph
            let box = this.$refs.svg.getBBox()
            this.$refs.svg.setAttribute(
                'viewBox',
                `${box.x} ${box.y} ${box.width} ${box.height}`,
            )
        },
        // draw given display graph in svg element
        drawGraph: function(graph) {
            // Layout
            let options = graph.graph()
            options.rankdir = 'LR'

            let inner = d3.select(this.$refs.inner)
            // We need to clear graph due to link wrapping changes
            inner.select('g').remove()
            let render = new dagreD3.render()

            // Render the graph using d3
            render(inner, graph)
            
            this.wrapNodes(graph)
            if (this.tooltips) {
                this.setupTooltips()
            }

            let headingSpace = this.positionHeadings()
            this.positionGraph(headingSpace)
            this.setViewBox()
        },
    }
}
</script>

<style>
/*
 * Can't use scoped css here since dynamically added elements wont have the attribute
 * So we are using the metadata-display class for scoping the rules
 */

/* Set text size */
svg.metadata-display text {
  font-size: 11px;
  font-weight: 300;
}

/* Make title larger and bolder */
svg.metadata-display tspan.title {
    font-size: 12px;
    font-weight: 500;
}

svg.metadata-display g.headings text {
    font-size: 16px;
    font-weight: 500;
}

svg.metadata-display a:link, svg.metadata-display a:visited {
    cursor: pointer;
}

svg.metadata-display a:hover, svg.metadata-display a:active {
    text-decoration: underline;
}

/* Syle node boxes */
svg.metadata-display .node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1.5px;
}

/* Override for selected nodes */
svg.metadata-display .selected rect {
    fill: lightgreen;
}

/* Style edges */
svg.metadata-display .edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
}
</style>
