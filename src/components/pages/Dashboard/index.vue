<template>
  <div>
    <div class="tile is-vertical">
      
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child box light">
            <p class="subtitle white is-5">New to Parsegarden?</p>
            <div class="block">
              <p class="subtitle is-5"><strong class="white">Sign up with Twitter</strong></p>
              <div class="control is-3">
                <a class="button is-medium" href="#">Sign up</a>
              </div>
            </div>
          </article>
          <article class="tile is-child box">
            <div class="block">
              <p class="title is-5">Track a Twitter query over time</p>
              <p><strong>Discover Patterns</strong></p>
              <p>Learn the language, hashtags, and influential users</p>
              <p><strong>Discover Content</strong></p>
              <p>Read the most engaging tweets</p>
            </div>
            <div class="control">
              <a class="button is-medium is-info" href="#">Tutorial</a>
            </div>
          </article>
        </div>

        <div class="tile is-parent is-vertical is-9">
          <article class="tile is-child box" style="position: relative" v-loading="getLoadStatus" :loading-options="{ queryText: getQueryMessage, rangeText: getRangeMessage }">
            <div class="block is-flex">
              <label class="label"># of tweets from</label>
              <div class="control is-horizontal">
                <mz-datepicker format="M/d/yy" :start-time="getFormattedStart" :end-time="getFormattedEnd" range en confirm :on-confirm="confirmTimeRange"></mz-datepicker> 
              </div>
            </div>
            <time-graph :width="getGraphWidth" :height="getGraphHeight"></time-graph>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" style="position: relative" v-loading="getLoadStatus" :loading-options="{ queryText: getQueryMessage, rangeText: getRangeMessage }">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <tabs size="medium" type="boxed">
              <tab-pane label="Language">
                <filter-table title="Language" :schema="wordSchema" :collection="getWordCollection"></filter-table>
              </tab-pane>
              <tab-pane label="Hashtags">
                <filter-table title="Hashtags" :schema="tagSchema" :collection="getTagCollection"></filter-table>
              </tab-pane>
              <tab-pane label="Users">
                <filter-table title="Users" :schema="userSchema" :collection="getUserCollection"></filter-table>
              </tab-pane>
            </tabs>
          </article>
        </div>

        <div class="tile is-6">
          <tweet-table title="Tweets" :collection="getTweetCollection"></tweet-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { performQuery, setStart, setEnd, confirmTimeRange, clearQuery } from '../../../vuex/actions'
import {
  getQueryToken,
  getQueryResult,
  getFormattedStart,
  getFormattedEnd,
  getStart,
  getEnd,
  getGraphWidth,
  getGraphHeight,
  getLoadStatus
} from '../../../vuex/getters'

import Chart from 'vue-bulma-chartjs'
import MzDatepicker from '../../../lib/VueDatepicker'
import TimeGraph from 'components/TimeGraph'
import FilterTable from 'components/FilterTable'
import TweetTable from 'components/TweetTable'
import loading from '../../../lib/vue-loading'
import moment from 'moment'
import { Tabs, TabPane } from 'vue-bulma-tabs'

export default {
  directives: {
    loading
  },

  components: {
    Chart,
    TimeGraph,
    MzDatepicker,
    FilterTable,
    TweetTable,
    Tabs,
    TabPane
  },

  vuex: {
    getters: {
      getQueryToken,
      getQueryResult,
      getFormattedStart,
      getFormattedEnd,
      getStart,
      getEnd,
      getGraphWidth,
      getGraphHeight,
      getLoadStatus
    },
    actions: {
      performQuery,
      setStart,
      setEnd,
      confirmTimeRange,
      clearQuery
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
      let outArr = []
      if (this.getQueryResult.tweets !== null && this.getQueryResult.tweets !== undefined) {
        outArr = this.getQueryResult.tweets.map(function (obj) {
          // obj.formattedText = twemoji.parse(obj.rawText)
          return obj
        })
        console.log('getTweetCollection', outArr.length)
      }
      return outArr
    },
    getQueryMessage () {
      return 'Loading ' + this.getQueryToken.toUpperCase()
    },
    getRangeMessage () {
      return moment(this.getStart, 'X').format('MMM Do') + ' to ' + moment(this.getEnd, 'X').format('MMM Do')
    },
    getLoadMessage () {
      return 'LOADING ' + this.getQueryToken.toUpperCase() + ' ' + moment(this.getStart, 'X').format('MMM Do') + ' to ' + moment(this.getEnd, 'X').format('ll')
    }
  },

  ready () {
    let self = this

    this.$store.watch(getFormattedStart, function (start) {
      console.log('WATCH getFormattedStart', start)
      // DISPATCH CLEAR_QUERY_RESULT
      self.clearQuery()
      // DISPATCH START_DRAW
      self.performQuery()
    })
    this.$store.watch(getQueryToken, function (queryStr) {
      console.log('WATCH getQueryToken', queryStr)
      // DISPATCH CLEAR_QUERY_RESULT
      self.clearQuery()
      // DISPATCH START_DRAW
      self.performQuery()
    })
  }
}
</script>

<style lang="scss" scoped>
label {
  padding: 8px;
}

.is-loading:after {
  height: 30px;
  width: 30px;
  border: 4px solid blue;
  border-right-color: transparent;
  border-left-color: transparent;
}

.white {
  color: white;
}

.light {
  background: #3B6BA2;
}
</style>
