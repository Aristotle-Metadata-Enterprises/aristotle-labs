<template>
    <div class="placeholder-bar-graph">
        <p>Bar graph goes here</p>
    </div>
</template>

<style>
.placeholder-bar-graph {
    width: 70%;
    height: 300px;
    background-color: gray;
}

.placeholder-bar-graph p {
    text-align: center;
    padding-top: 100px;
}
</style>
<script>
import {Bar} from 'vue-chartjs'
export default {
    props: {
        chartData: {
            type: Array | Object,
            required: false
        },
        chartLabels: {
            type: Array,
            required: true
        },
        chartLabel: {
            type: String,
            default: "",
            required: true,
        }
    },
    data() {
        // Data function to return general purpose config
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    mounted () {
        // Render chart with data
      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: this.chartLabel,
            borderColor: '#249EBF',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            backgroundColor: 'transparent',
            data: this.chartData
          }
        ]
      }, this.options)
    }
}
</script>
