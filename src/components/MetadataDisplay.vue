<template>
    <div>
        <p>Metadata Display</p>
        <svg class="metadata-display" ref="svg" :xmlns="svg_ns" width="100%" height="500">
            <g />
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
        svg_ns: 'http://www.w3.org/2000/svg'
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
        // Whether the graph can be panned and zoomed with mouse
        zoomable: {
            type: Boolean,
            default: false,
        },
        // Whether to display tooltips on hover of graph elements
        tooltips: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        // Construct maps representing graph, used to contruct final filtered graph
        graph: function() {
            // Map of id to id of parents along with edge description
            let parents = new Map()
            // Map of node id's to node names and type
            let nodeInfo = new Map()

            if (this.dss) {
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
        // Compute dag based on selected
        selected: function(selected) {
            let graph = this.createDisplayGraph(selected)
            this.drawGraph(graph)
        }
    },
    methods: {
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
            let name = this.createSvgElement('tspan', {dy: '1em', x: '1'}, info.name)
            let type = this.createSvgElement('tspan', {dy: '1em', x: '1'}, `(${info.type})`)

            let text = this.createSvgElement('text')
            text.appendChild(name)
            text.appendChild(type)

            let link = this.createSvgElement('a', {
                href: `https://registry.aristotlemetadata.com/item/${info.id}`,
            })
            link.appendChild(text)

            return link
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
                        dgraph.setNode(
                            val,
                            {
                                label: this.getNodeLabel(info),
                                labelType: 'svg',
                                class: 'selected',
                                aristotleId: info.id,
                            }
                        )
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
                    dgraph.setNode(
                        parent.parent,
                        {label: this.getNodeLabel(info), labelType: 'svg', aristotleId: info.id}
                    )
                    dgraph.setEdge(parent.parent, uuid, {label: parent.edgeLabel})
                    nodeStack.push(parent.parent)
                }
            }

            return dgraph
        },
        drawGraph: function(graph) {
            // Layout
            let options = graph.graph()
            options.rankdir = 'LR'
            // node options
            graph.nodes().forEach((n) => {
                let node = graph.node(n)
                node.ry = 5
                node.rx = 5
            })

            let svg = d3.select(this.$refs.svg)
            let inner = svg.select('g')
            let render = new dagreD3.render()
            render(inner, graph)

            inner.selectAll('g.node rect').attr('data-aristotle-concept-id', (node_id) => {
                let node = graph.node(node_id)
                return node.aristotleId
            })

            if (this.tooltips) {
                aristotleTooltip({
                    url: 'https://registry.aristotlemetadata.com',
                    interactive: false,
                    definitionWords: 40,
                })
            }

            // Zoom support
            let zoom
            if (this.zoomable) {
                zoom = d3.zoom().on('zoom', () => {
                    inner.attr('transform', d3.event.transform)
                })
                svg.call(zoom)
            }

            // Center graph
            let xOffset = (this.$refs.svg.clientWidth - graph.graph().width) / 2
            let yPadding = 20
            if (this.zoomable) {
                svg.call(zoom.transform, d3.zoomIdentity.translate(xOffset, yPadding))
            } else {
                inner.attr('transform', `translate(${xOffset}, ${yPadding})`)
            }
            svg.attr('height', graph.graph().height + (yPadding * 2))
        }
    }
}
</script>

<style>
/*
 * Can't use scoped css here since dynamically added elements wont have the attribute
 * So we are using the metadata-display class for scoping the rules
 */

svg.metadata-display {
    border: 1px solid black;
}

/* Set text size */
svg.metadata-display text {
  font-size: 11px;
  font-weight: 300;
}

/* Style for text within links */
svg.metadata-display a text {
    fill: black;
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
