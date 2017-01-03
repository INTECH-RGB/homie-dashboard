
<script>
import VueCharts from 'vue-chartjs'
import { Line } from 'vue-chartjs'

export default Line.extend({
  props: ['stat'],
  watch: {
    stat: function (newStat) {
          if( newStat !== null)
          {
            let label = null
            let datasets = []
            let labels = []
            newStat.forEach(function (element) {
                if(label == null) {
                    label = element.property_id
                }
                datasets.push(element.value)
                labels.push(element.date)
            })
            let dataChart = {
                    labels: labels,
                    datasets: [
                        {
                        label: label,
                        backgroundColor: '#f87979',
                        data: datasets
                        }
                    ]
              }
             this.renderTheChart(dataChart)
          }
      }
  },
  methods: {
    renderTheChart: function (dataChart) {
          this.renderChart(dataChart)
      }
  }
})
</script>

<style lang="sass" scoped>

</style>
