<template>
  <div>
    <canvas ref="chart" width="583" height="400"></canvas>
    <h2 v-if="!dataAvailable">Aucune données pour la plage sélectionnée.</h2>

    <div class="has-text-centered">
      <a class="button" :class="{ 'is-primary': granularity === STATS_GRANULARITY.MONTH }" @click="changeGranularity(STATS_GRANULARITY.MONTH)">Par mois</a>
      <a class="button" :class="{ 'is-primary': granularity === STATS_GRANULARITY.DAY }" @click="changeGranularity(STATS_GRANULARITY.DAY)">Par jour</a>
      <a class="button" :class="{ 'is-primary': granularity === STATS_GRANULARITY.HOUR }" @click="changeGranularity(STATS_GRANULARITY.HOUR)">Par heure</a>

      <template v-if="granularity === STATS_GRANULARITY.HOUR || granularity === STATS_GRANULARITY.DAY">
        <br><br>
        <span v-if="granularity === STATS_GRANULARITY.HOUR">Jour </span>
          <span v-else>7 jours précédant le </span>
        <date-picker :date="datePicker.date" :option="datePicker.options"></date-picker>
      </template>
      <template v-if="granularity === STATS_GRANULARITY.MONTH">
        <br><br>
        Année 2017
      </template>
    </div>
  </div>

</template>
<script>
import {mapActions} from 'eva.js'
import Chart from 'chart.js'
import DatePicker from 'vue-datepicker'
import moment from 'moment'
import 'moment/locale/fr'

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
        }
      },
      range: {
        startDay: null,
        day: null,
        endDay: null,
        year: null
      },
      dataAvailable: false,
      chart: null
    }
  },
  components: {DatePicker},
  created () {
    moment.locale('fr')
    this.property = this.properties[0]
    this.range.day = new Date().toISOString().split('T')[0]
    this.range.endDay = this.range.day
    this.range.startDay = moment(this.range.endDay).subtract(7, 'days').toISOString().split('T')[0]
    this.range.year = this.range.day.split('-')[0]
    this.datePicker.date.time = this.range.day
  },
  mounted () {
    this.renderChart()
  },
  watch: {
    'datePicker.date.time' (val) {
      this.range.day = val
      this.range.endDay = this.range.day
      this.range.startDay = moment(this.range.endDay).subtract(7, 'days').toISOString().split('T')[0]
      this.range.year = this.range.day.split('-')[0]

      this.renderChart()
    }
  },
  methods: {
    async renderChart () {
      const datapoints = await this.getStatistics()

      this.dataAvailable = datapoints.length !== 0

      if (!this.dataAvailable) return

      let labels = []
      let minimums = []
      let averages = []
      let maximums = []

      for (const datapoint of datapoints) {
        let date
        switch (this.granularity) {
          case STATS_GRANULARITY.MONTH:
            date = new Date(parseInt(datapoint.year, 10), parseInt(datapoint.month, 10) - 1)
            break
          case STATS_GRANULARITY.DAY:
            date = new Date(datapoint.day)
            break
          case STATS_GRANULARITY.HOUR:
            date = new Date(datapoint.day)
            date.setUTCHours(parseInt(datapoint.hour, 10))
            break
        }
        labels.push(date)
        minimums.push(datapoint.minimum)
        averages.push(datapoint.average)
        maximums.push(datapoint.maximum)
      }

      const timeScale = {}

      if (this.granularity === STATS_GRANULARITY.HOUR) {
        Object.assign(timeScale, {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          },
          tooltipFormat: 'DD/MM/YYYY à HH:mm'
        })
      } else if (this.granularity === STATS_GRANULARITY.DAY) {
        Object.assign(timeScale, {
          unit: 'day',
          displayFormats: {
            day: 'DD/MM/YYYY'
          },
          tooltipFormat: 'DD/MM/YYYY'
        })
      } else if (this.granularity === STATS_GRANULARITY.MONTH) {
        Object.assign(timeScale, {
          unit: 'month',
          displayFormats: {
            month: 'MMMM'
          },
          tooltipFormat: 'MM/YYYY'
        })
      }

      if (this.chart) this.chart.destroy()
      this.chart = new Chart(this.$refs.chart, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Minimum',
              steppedLine: true,
              borderColor: 'rgba(46, 204, 113, 1.0)',
              backgroundColor: 'rgba(46, 204, 113, 0.5)',
              borderWidth: '3px',
              data: minimums
            },
            {
              label: 'Moyenne',
              steppedLine: true,
              borderColor: 'rgba(52, 152, 219, 1.0)',
              backgroundColor: 'rgba(52, 152, 219, 0.5)',
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
          responsive: false,
          title: {
            display: true,
            text: `${this.property.name} par ${this.granularity === STATS_GRANULARITY.MONTH ? 'mois' : this.granularity === STATS_GRANULARITY.DAY ? 'jour' : 'heure'}`
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: timeScale
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
