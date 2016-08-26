<template>
  <div>
    <div class="tile is-vertical">
      
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child box light">
            <p class="title white is-4">New to Parsegarden?</p>
            <div class="block">
              <p class="subtitle is-5 white">Sign up with your Twitter account</p>
              <div class="control is-3">
                <a class="button is-medium" href="#">Sign up</a>
              </div>
            </div>
          </article>
          <article class="tile is-child box">
            <!--<p><strong>Track Search Queries</strong></p>-->
            <p class="title is-5">Track the results of Twitter searches over time</p>
            <p><strong>Find Patterns</strong></p>
            <p class="subtitle">Explore the language and hashtags used and find influential users within a query</p>
            <p><strong>Discover Content</strong></p>
            <p class="subtitle">Read the most engaging tweets from a search query</p>
            <div class="control">
              <a class="button is-medium is-info" href="#">Tutorial</a>
            </div>
          </article>
        </div>

        <div class="tile is-parent is-vertical is-9">
          <article class="tile is-child box" style="position: relative" v-loading="getLoadStatus" :loading-options="{ text: getLoadMessage }">
            <div class="block is-flex">
              <label class="label"># of tweets from</label>
              <div class="control is-horizontal">
                <mz-datepicker format="M/d/yy" :start-time.sync="getFormattedStart" :end-time.sync="getFormattedEnd" range en confirm :on-confirm="confirmTimeRange"></mz-datepicker> 
              </div>
            </div>
            <time-graph :count="getDrawCount" :width="getGraphWidth" :height="getGraphHeight"></time-graph>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" style="position: relative" v-loading="getLoadStatus" :loading-options="{ text: getLoadMessage }">
        <div class="tile">
          <filter-table title="Language" :schema="wordSchema" :collection="getWordCollection"></filter-table>
          <!--<filter-table title="Hashtags" :schema="tagSchema" :collection="getTagCollection"></filter-table>-->
          <!--<filter-table title="Users" :schema="userSchema" :collection="getUserCollection"></filter-table>-->
        </div>
        <div class="tile is-6">
          <tweet-table title="Tweets" :collection="getTweetCollection"></tweet-table>
        </div>
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
  getStart,
  getEnd,
  getGraphWidth,
  getGraphHeight,
  getDrawCount,
  getLoadStatus
} from '../../../vuex/getters'

import Chart from 'vue-bulma-chartjs'
import MzDatepicker from '../../../lib/VueDatepicker'
import TimeGraph from 'components/TimeGraph'
import FilterTable from 'components/FilterTable'
import TweetTable from 'components/TweetTable'
import loading from 'vue-loading'
import moment from 'moment'

export default {
  directives: {
    loading
  },

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
      getStart,
      getEnd,
      getGraphWidth,
      getGraphHeight,
      getDrawCount,
      getLoadStatus
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
      let outArr = []
      if (this.getQueryResult.tweets !== null && this.getQueryResult.tweets !== undefined) {
        outArr = this.getQueryResult.tweets.map(function (obj) {
          // obj.formattedText = twemoji.parse(obj.rawText)
          return obj
        })
        console.log('getTweetCollection', outArr[0])
      }
      return outArr
    },
    getLoadMessage () {
      return 'loading results for ' + moment(this.getStart, 'X').fromNow() + ' to ' + moment(this.getEnd, 'X').fromNow() + ' ...'
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

<style>
.vue-loading-msg {
  height: 60px;
}
</style>
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
