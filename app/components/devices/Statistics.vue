<template>
  <div>
    <canvas ref="chart"></canvas>

    <div class="has-text-centered">
      <a class="button" :class="{ 'is-primary': granularity === STATS_GRANULARITY.DAY }" @click="changeGranularity(STATS_GRANULARITY.DAY)">Par jour</a>
      <a class="button" :class="{ 'is-primary': granularity === STATS_GRANULARITY.HOUR }" @click="changeGranularity(STATS_GRANULARITY.HOUR)">Par heure</a>

      <br>
      <template v-if="granularity === STATS_GRANULARITY.HOUR">
        <date-picker :date="datePicker.date" :option="datePicker.options"></date-picker>
      </template>
    </div>
  </div>

</template>
<script>
import {mapActions} from 'eva.js'
import Chart from 'chart.js'
import DatePicker from 'vue-datepicker'

import {STATS_TYPES, STATS_GRANULARITY} from '../../../common/statistics'

export default {
  props: ['deviceId', 'nodeId', 'properties'],
  data () {
    return {
      STATS_GRANULARITY,
      granularity: STATS_GRANULARITY.HOUR,
      property: {},
      datePicker: {
        options: {
          type: 'day',
          week: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          month: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          format: 'YYYY-MM-DD',
          placeholder: 'Quel jour ?',
          inputStyle: {
            'display': 'inline-block',
            'padding': '6px',
            'line-height': '22px',
            'font-size': '16px',
            'border': '2px solid #fff',
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
            'color': '#5F5F5F'
          },
          buttons: {
            ok: 'OK',
            cancel: 'Annuler'
          }
        },
        date: {
          time: ''
        },
        startDate: {
          time: ''
        },
        endDate: {
          time: ''
        }
      },
      range: {
        startDay: null,
        day: null,
        endDay: null
      },
      chart: null
    }
  },
  components: {DatePicker},
  created () {
    this.property = this.properties[0]
    this.range.day = new Date().toISOString().split('T')[0]
    this.datePicker.date.time = this.range.day
  },
  mounted () {
    this.renderChart()
  },
  watch: {
    datePicker (val) {
      console.log(val)
      this.range.startDay = val.startDate.time
      this.range.day = val.date.time
      this.range.endDay = val.endDate.time

      this.renderChart()
    }
  },
  methods: {
    async renderChart () {
      const datapoints = await this.getStatistics()

      let labels = []
      let minimums = []
      let averages = []
      let maximums = []

      for (const datapoint of datapoints) {
        const date = new Date(datapoint.day)
        date.setUTCHours(parseInt(datapoint.hour, 10))
        labels.push(date)
        minimums.push(datapoint.minimum)
        averages.push(datapoint.average)
        maximums.push(datapoint.maximum)
      }

      this.chart = new Chart(this.$refs.chart, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Minimum',
              steppedLine: true,
              borderColor: 'rgba(52, 152, 219, 1.0)',
              backgroundColor: 'rgba(52, 152, 219, 0.5)',
              borderWidth: '3px',
              data: minimums
            },
            {
              label: 'Moyenne',
              steppedLine: true,
              borderColor: 'rgba(230, 126, 34, 1.0)',
              backgroundColor: 'rgba(230, 126, 34, 0.5)',
              borderWidth: '3px',
              data: averages
            },
            {
              label: 'Maximum',
              steppedLine: true,
              borderColor: 'rgba(231, 76, 60, 1.0)',
              backgroundColor: 'rgba(231, 76, 60, 0.5)',
              borderWidth: '3px',
              data: maximums
            }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH:mm'
                }
              }
            }]
          }
        }
      })
    },
    changeGranularity (granularity) {
      this.granularity = granularity
      this.renderChart()
    },
    async getStatistics () {
      const result = await this.getStatisticsAction({
        deviceId: this.deviceId,
        nodeId: this.nodeId,
        propertyId: this.property.id,
        type: STATS_TYPES.GRAPH,
        granularity: this.granularity,
        range: this.range
      })
      return result
    },
    ...mapActions({getStatisticsAction: 'getStatistics'})
  }
}
</script>

<style lang="sass" scoped>

</style>
