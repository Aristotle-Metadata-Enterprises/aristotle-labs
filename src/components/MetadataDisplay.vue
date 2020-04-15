<template>
    <div>
        <p>Metadata display</p>
        <svg ref="svg" width="1000" height="500">
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
    watch: {
        // Compute dag based on selected
        selected: function(selected) {
            let graph = new dagreD3.graphlib.Graph()
            graph.setGraph({})

            if (this.dss) {
                // Create root dss node
                graph.setNode(this.dss.uuid, {label: this.dss.name})
                // Create test node with a selected uuid
                graph.setNode("123", {"label": selected.values().next().value})
                graph.setEdge(this.dss.uuid, "123", {})
            }
            
            let svg = d3.select(this.$refs.svg)
            let inner = svg.select('g')
            let render = new dagreD3.render()
            render(inner, graph)

            let xOffset = (svg.attr('width') - graph.graph().width) / 2
            let yPadding = 20
            inner.attr('transform', `translate(${xOffset}, ${yPadding})`)
            svg.attr('height', graph.graph().height + (yPadding * 2))
        }
    }
}
</script>

<style>
text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1.5px;
}

.edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
}
</style>
