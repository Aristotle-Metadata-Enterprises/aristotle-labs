<script>
import {Bar, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Bar,
    mixins: reactiveProp,
    data: () => ({
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                    },
                    gridLines: {
                        display: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    }),
    mounted: function () {
        this.renderChart(this.chartData, this.options)
    },
}
</script>