<template>
  <div>
    <div class="tile is-vertical">
      
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical is-3">
          <article class="tile is-child box light">
            <p class="subtitle"><strong class="white">New to Parsegarden?</strong></p>
            <p class="subtitle content white">Sign up now to analyze and compare trends on Twitter</p>
            <p class="control">
              <a class="button is-medium is-info" href="#">Sign up</a>
            </p>
          </article>
          <article class="tile is-child box">
            <p><strong>Track Trends</strong></p>
            <p class="subtitle content">Easily track any set of Twitter queries</p>
            <p><strong>Find Patterns</strong></p>
            <p class="subtitle content">Explore the language and hashtags used and find influencers</p>
            <p><strong>Discover Content</strong></p>
            <p class="subtitle content">Read the most engaging tweets over time</p>
          </article>
        </div>

        <div class="tile is-parent is-vertical is-9">
          <!--
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
          -->
          <article class="tile is-child box">
            <div class="control is-horizontal">
              <mz-datepicker format="yyyy-MM-dd" :start-time.sync="getFormattedStart" :end-time.sync="getFormattedEnd" range en confirm :on-confirm="confirmTimeRange"></mz-datepicker> </div>
            <time-graph :count="getDrawCount" :width="getGraphWidth" :height="getGraphHeight"></time-graph>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor">
        <filter-table title="Words" :schema="wordSchema" :collection="getWordCollection"></filter-table>
        <filter-table title="Hashtags" :schema="tagSchema" :collection="getTagCollection"></filter-table>
        <filter-table title="Users" :schema="userSchema" :collection="getUserCollection"></filter-table>
        <tweet-table title="Tweets" :collection="getTweetCollection"></tweet-table>
      </div>

    </div>
  </div>
</template>

<script>
import { performQuery, setStart, setEnd, confirmTimeRange } from '../../../vuex/actions'
import {
  getQueryResult,
  getFormattedStart,
  getFormattedEnd,
  getGraphWidth,
  getGraphHeight,
  getDrawCount
} from '../../../vuex/getters'

import Chart from 'vue-bulma-chartjs'
import MzDatepicker from '../../../lib/VueDatepicker'
import TimeGraph from 'components/TimeGraph'
import FilterTable from 'components/FilterTable'
import TweetTable from 'components/TweetTable'

export default {
  components: {
    Chart,
    TimeGraph,
    MzDatepicker,
    FilterTable,
    TweetTable
  },

  vuex: {
    getters: {
      getQueryResult,
      getFormattedStart,
      getFormattedEnd,
      getGraphWidth,
      getGraphHeight,
      getDrawCount
    },
    actions: {
      performQuery,
      setStart,
      setEnd,
      confirmTimeRange
    }
  },

  data: function () {
    return {
      wordSchema: [{ token: 'Token' }],
      tagSchema: [{ token: 'Tag' }],
      userSchema: [{ token: 'Handle' }],
      startTime: new Date('2016-03-31').getTime(),
      endTime: new Date('2016-04-12').getTime()
    }
  },

  computed: {
    defaultStart () {
      return { defaultDate: this.getFormattedStart, enableTime: true }
    },
    defaultEnd () {
      return { defaultDate: this.getFormattedEnd, enableTime: true }
    },
    getWordCollection () {
      return this.getQueryResult.words ? this.getQueryResult.words.filter(function (obj) { return obj.token[0] !== '@' && obj.token[0] !== '#' }) : []
    },
    getTagCollection () {
      return this.getQueryResult.words ? this.getQueryResult.words.filter(function (obj) { return obj.token[0] === '#' }) : []
    },
    getUserCollection () {
      return this.getQueryResult.words ? this.getQueryResult.words.filter(function (obj) { return obj.token[0] === '@' }) : []
    },
    getTweetCollection () {
      return this.getQueryResult.tweets
    }
  },

  ready () {
    let self = this

    this.$store.watch(getFormattedStart, function (start) {
      console.log('WATCH start', start)
      self.performQuery()
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
