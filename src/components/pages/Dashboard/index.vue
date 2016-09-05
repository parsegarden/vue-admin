<template>
  <div>
    <div class="tile is-vertical">
      
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical">
          <article class="tile is-child box light">
            <p class="subtitle white is-5" style="padding: 0;">New to Parsegarden?</p>
            <div class="block">
              <p class="subtitle is-5" style="padding: 0;"><strong class="white">Sign up with Twitter</strong></p>
              <div class="control is-3">
                <a class="button is-medium" href="#" style="width: 100%;"><span class="icon"> <i class="fa fa-twitter"></i> </span><span>Sign up</span></a>
              </div>
            </div>
          </article>
          <article class="tile is-child box">
            <div class="block">
              <p class="title is-5">Track a Twitter query over time</p>
              <p><strong>Over {{ getTotalCount }} tweets indexed</strong></p>
              <p>Read the most engaging tweets</p>
              <p><strong>Discover Patterns</strong></p>
              <p>Learn the language, hashtags, and influential users</p>
              <p><strong>Discover Content</strong></p>
              <p>Read the most engaging tweets</p>
            </div>
            <div class="control">
              <a class="button is-medium is-info" href="#" style="width: 100%;">Tutorial</a>
            </div>
          </article>
        </div>

        <div class="tile is-parent is-vertical is-9">
          <article class="tile is-child box" style="position: relative" v-loading="getLoadStatus" :loading-options="{ queryText: getQueryMessage, rangeText: getRangeMessage }">
            <div class="block is-flex">
              <h2 class="subtitle"># of tweets found searching for <strong>"{{ getQueryToken }}"</strong> from <strong>{{ getFormattedStart }}</strong> to <strong>{{ getFormattedEnd }}</strong></h2>
            </div>
            <div class="block">
              <progress-bar v-if="getPercentage < 90" :type="'success'" :size="'large'" :value="getPercentage" :max="100" :show-label="true"></progress-bar>
            </div>
            <time-graph></time-graph>
          </article>
        </div>
      </div>

      <div class="tile is-ancestor" style="position: relative" v-loading="getLoadStatus" :loading-options="{ queryText: getQueryMessage, rangeText: getRangeMessage }">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <tabs size="medium" type="boxed">
              <tab-pane label="Trending Words">
                <filter-table title="Trending Words" :schema="wordSchema" :collection="getWordCollection"></filter-table>
              </tab-pane>
              <tab-pane label="Hashtags">
                <filter-table title="Hashtags" :schema="tagSchema" :collection="getTagCollection"></filter-table>
              </tab-pane>
              <tab-pane label="Users">
                <filter-table title="Users" :schema="userSchema" :collection="getUserCollection | limit 120"></filter-table>
              </tab-pane>
            </tabs>
          </article>
        </div>

        <div class="tile is-6">
          <tweet-table title="Tweets" :collection="getTweetCollection | limit 40"></tweet-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
var stopList = [
  'via',
  'that',
  'this',
  'will',
  'with',
  'about',
  'from',
  'have',
  'like',
  'just',
  'what',
  'when',
  'they',
  'says',
  'dont',
  'your',
  'only',
  'would',
  'said',
  'cant',
  'very',
  'them',
  'after',
  'than',
  'does',
  'into',
  'their',
  'shes',
  'there',
  'wont',
  'isnt',
  'doesnt',
  'couldnt',
  'been',
  'whats',
  'sure',
  'then',
  'didnt',
  'whos',
  'were',
  'retweet',
  'theyre',
  'come',
  'while',
  'gets',
  'because',
  'thats',
  'could',
  'being',
  'watch',
  'more',
  'even',
  'should',
  'still',
  'other',
  'herself',
  'against',
  'think',
  'want',
  'give',
  'took',
  'over',
  'sent',
  'either',
  'talking',
  'asked',
  'totally',
  'part',
  'uses',
  'former',
  'another',
  'know',
  'again',
  'make',
  'really',
  'saying',
  'thing',
  'must',
  'many',
  'these',
  'here',
  'made',
  'another',
  'again',
  'make',
  'read',
  'take',
  'well',
  'great',
  'back',
  'going',
  'next',
  'enough',
  'wants',
  'ever',
  'some',
  'knows',
  'asks',
  'good',
  'probably',
  'tell',
  'around',
  'already',
  'away',
  'between',
  'agree',
  'theres',
  'doing',
  'calling',
  'held',
  'people',
  'news',
  'under',
  'mean',
  'show',
  'anyone',
  'youre',
  'where',
  'much',
  'down',
  'most',
  'getting',
  'least',
  'yeah',
  'quite',
  'look',
  'last',
  'please',
  'those',
  'told',
  'better',
  'biggest',
  'also',
  'lets',
  'since',
  'which',
  'himself',
  'before',
  'behind',
  'want',
  'showed',
  'until',
  'everyone',
  'meet',
  'exactly',
  'wanted',
  'rather',
  'several',
  'amid',
  'thinks',
  'prefer',
  'describes',
  'went',
  'currently',
  'bring',
  'actually',
  'anybody',
  'hasnt',
  'best',
  'needs',
  'every',
  'used',
  'help',
  'need',
  'believe',
  'asking',
  'called',
  'making',
  'less',
  'cannot',
  'same',
  'things',
  'soon',
  'makes',
  'heres',
  'during',
  'latest',
  'gave',
  'year',
  'years',
  'call',
  'calls',
  'gave',
  'shows',
  'right',
  'wasnt',
  'arent',
  'havent'
]

import {
  performQuery,
  setStart,
  setEnd,
  clearQuery
} from '../../../vuex/actions'

import {
  getQueryToken,
  getQueryResult,
  getStart,
  getEnd,
  getLoadStatus,
  getLastTimeKey,
  getSubToken,
  getFormattedStart,
  getFormattedEnd
} from '../../../vuex/getters'

import TimeGraph from 'components/TimeGraph'
import FilterTable from 'components/FilterTable'
import TweetTable from 'components/TweetTable'
import loading from '../../../lib/vue-loading'
import ProgressBar from '../../../lib/ProgressBar'

import moment from 'moment'
import numeral from 'numeral'
import Chart from 'vue-bulma-chartjs'
import { Tabs, TabPane } from 'vue-bulma-tabs'

export default {
  directives: {
    loading
  },

  components: {
    Chart,
    TimeGraph,
    FilterTable,
    TweetTable,
    Tabs,
    TabPane,
    ProgressBar
  },

  vuex: {
    getters: {
      getQueryToken,
      getQueryResult,
      getStart,
      getEnd,
      getLoadStatus,
      getLastTimeKey,
      getFormattedStart,
      getFormattedEnd
    },
    actions: {
      performQuery,
      setStart,
      setEnd,
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
    getTotalCount () {
      console.log('getTotalCount', this.getQueryResult.getTotalCount)
      return numeral(this.getQueryResult.totalCount).format('0,0')
    },
    getWordCollection () {
      return this.getQueryResult.words ? this.getQueryResult.words.filter(function (obj) { return obj.token[0] !== '@' && obj.token[0] !== '#' && obj.token.length > 3 && stopList.indexOf(obj.token) === -1 }) : []
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
          return obj
        })
        let self = this
        outArr = outArr.filter(function (obj) {
          return obj.rawText.toLowerCase().indexOf(self.getQueryToken.toLowerCase()) !== -1
        })
        // console.log('getTweetCollection', outArr.length)
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
    },
    getPercentage () {
      console.log('getPercentage', this.getStart, this.getEnd, this.getLastTimeKey)
      let value = Math.floor((this.getStart - this.getLastTimeKey) / (this.getStart - this.getEnd) * 100)
      return value > 0 ? value : 0
    }
  },

  ready () {
    let self = this

    this.$store.watch(getQueryToken, function (queryStr) {
      console.log('WATCH getQueryToken', queryStr)
      // DISPATCH CLEAR_QUERY_RESULT
      self.clearQuery()
      // DISPATCH START_DRAW
      self.performQuery()
    })
    this.$store.watch(getSubToken, function (subToken) {
      console.log('WATCH getSubToken', subToken)
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
