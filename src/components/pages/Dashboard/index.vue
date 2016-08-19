<template>
  <div>
    <div class="tile is-vertical">
      
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical is-3">
          <article class="tile is-child box light">
            <p class="title white">New to Parsegarden?</p>
            <p class="content white">Sign up now to analyze and compare trends on Twitter</p>
            <p class="control">
              <a class="button is-medium is-info" href="#">Sign up</a>
            </p>
          </article>
          <article class="tile is-child box">
            <p><strong>Track Trends</strong></p>
            <p class="content">Easily track any set of Twitter queries</p>
            <p><strong>Find Patterns</strong></p>
            <p class="content">Explore the language and hashtags used and find influencers</p>
            <p><strong>Discover Content</strong></p>
            <p class="content">Read the most engaging tweets over time</p>
          </article>
        </div>

        <div class="tile is-parent is-vertical is-9">
          <article class="tile is-child box">
            <div class="columns">
              <div class="column">
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">Start</h2>
                  </div>
                  <date-picker v-ref:start-date-time placeholder="Pick START date AND time" :config="defaultStart"></date-picker>
                </div>
              </div>
              <div class="column">
                <div class="control is-horizontal">
                  <div class="control-label">
                    <label class="label">End</h2>
                  </div>
                  <date-picker v-ref:end-date-time placeholder="Pick END date AND time" :config="defaultEnd"></date-picker>
                </div>
              </div>
            </div>
          </article>
          <article id="graph" class="tile is-child box">
            <time-graph :count="getDrawCount" :width="getGraphWidth" :height="getGraphHeight"></time-graph>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Words</p>
            <table class="table">
              <tbody>
                <tr><th>soon</th></tr>
              </tbody>
            </table>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Hashtags</p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Users</p>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Tweets</p>
          </article>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { performQuery, setStart, setEnd } from '../../../vuex/actions'
import {
  getFormattedStart,
  getFormattedEnd,
  getGraphWidth,
  getGraphHeight,
  getDrawCount
} from '../../../vuex/getters'

import Chart from 'vue-bulma-chartjs'
import DatePicker from 'vue-bulma-datepicker'
import TimeGraph from 'components/TimeGraph'

export default {
  components: {
    Chart,
    TimeGraph,
    DatePicker
  },

  vuex: {
    getters: {
      getFormattedStart,
      getFormattedEnd,
      getGraphWidth,
      getGraphHeight,
      getDrawCount
    },
    actions: {
      performQuery,
      setStart,
      setEnd
    }
  },

  computed: {
    defaultStart () {
      return { defaultDate: this.getFormattedStart, enableTime: true }
    },
    defaultEnd () {
      return { defaultDate: this.getFormattedEnd, enableTime: true }
    },
    chartData () {
      return {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
      }
    }
  },

  ready () {
    let self = this
    this.$store.watch(getFormattedStart, function (start) {
      console.log('WATCH start', start)
      self.performQuery()
    })
    this.$store.watch(getFormattedEnd, function (end) {
      console.log('WATCH end', end)
      self.performQuery()
    })

    this.$refs.startDateTime.datepicker.set('onChange', (d) => {
      self.setStart(d)
    })

    this.$refs.endDateTime.datepicker.set('onChange', (d) => {
      self.setEnd(d)
    })
  }
}
</script>

<style lang="scss" scoped>
.white {
  color: white;
}

.light {
  background: #3B6BA2;
}
</style>
