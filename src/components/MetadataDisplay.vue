<template>
    <div>
        <p>Metadata display</p>
        <svg class="metadata-display" ref="svg" width="1000" height="500">
            <g />
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'

export default {
    props: {
        dss: {
            type: Object,
            required: true,
        },
        selected: {
            type: Set,
            required: true,
        }
    },
    computed: {
        // Construct graphlib graph with whole dss structure
        graph: function() {
            let graph = new dagreD3.graphlib.Graph()
            graph.setGraph({})

            if (this.dss) {
                // Create root dss node
                graph.setNode(this.dss.uuid, {label: this.dss.name})
                for (let inc of this.dss.dssdeinclusionSet) {
                    graph.setNode(inc.dataElement.uuid, {label: inc.dataElement.name})
                    graph.setEdge(this.dss.uuid, inc.dataElement.uuid, {label: 'inclusion'})
                    for (let input of inc.dataElement.dedinputsthroughSet) {
                        graph.setNode(
                            input.dataElementDerivation.uuid,
                            {label: input.dataElementDerivation.name}
                        )
                        graph.setEdge(
                            inc.dataElement.uuid,
                            input.dataElementDerivation.uuid,
                            {label: 'input'}
                        )
                        for (let derive of input.dataElementDerivation.dedderivesthroughSet) {
                            graph.setNode(
                                derive.dataElement.uuid,
                                {label: derive.dataElement.name}
                            )
                            graph.setEdge(
                                input.dataElementDerivation.uuid,
                                derive.dataElement.uuid,
                                {label: 'dervies'}
                            )
                        }
                    }
                }
            }
            return graph
        },
        // Return paths from nodes to source dss
        sourcePaths: function() {
            if (this.dss) {
                return dagreD3.graphlib.alg.dijkstra(this.graph, this.dss.uuid)
            }
            return {}
        }
    },
    watch: {
        // Compute dag based on selected
        selected: function(selected) {
            let graph = this.graph
            let svg = d3.select(this.$refs.svg)
            let inner = svg.select('g')
            let render = new dagreD3.render()
            render(inner, graph)

            // Zoom support
            let zoom = d3.zoom().on('zoom', () => {
                inner.attr('transform', d3.event.transform)
            })
            svg.call(zoom)

            // Center graph
            let xOffset = (svg.attr('width') - graph.graph().width) / 2
            let yPadding = 20
            svg.call(zoom.transform, d3.zoomIdentity.translate(xOffset, yPadding))
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

.metadata-display text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.metadata-display .node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1.5px;
}

.metadata-display .edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
}
</style>
