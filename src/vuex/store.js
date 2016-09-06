import Vue from 'vue'
import Vuex from 'vuex'

import config from '../config'

const { menu } = config

Vue.use(Vuex)

let now = Math.round(new Date().getTime()/1000)
const state = {
  menu, // SHORT for 'menu: menu
  queryToken: 'hillary',
  queryResult: {
    totalCount: 33000000
  },
  start: now - 100000,
  end: now,
  drawCount: 0,
  loadStatus: true,
  lastEvaluatedKey: '',
  lastTimeKey: 0,
  subToken: '',
  subTokenResults: {},
  subTokens: [],
  stopList: [
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
    'havent',
    'weve',
    'yours',
    'mins',
    'couldve',
    'wouldnt',
    'feat'
  ]
}

const mutations = {
  // A mutation receives the current state as the first argument
  // You can make any modifications you want inside this function

  RESIZE (state) {
    state.drawCount = state.drawCount + 1
  },

  INCREMENT (state) {
    state.drawCount = state.drawCount + 1
  },

  CONFIRM_QUERY (state, queryStr) {
    console.log('CONFIRM_QUERY', queryStr)
    state.queryToken = queryStr
  },

  CLEAR_QUERY_RESULT (state) {
    state.queryResult = {}
  },

  SET_QUERY_RESULT (state, result) {
    state.queryResult = result
  },

  START_DRAW (state) {
    state.loadStatus = true
  },

  FINISH_DRAW (state) {
    state.loadStatus = false
  },

  CONFIRM_TIME_RANGE (state, start, end) {
    state.start = Math.floor(start)
    state.end = Math.floor(end)
    // console.log('STATE.start', state.start)
    // console.log('STATE.end', state.end)
  },

  SET_START (state, start) {
    state.start = start
    // console.log('STATE.start', state.start)
  },

  SET_END (state, end) {
    state.end = end
    // console.log('STATE.end', state.end)
  },

  SET_LAST_TIME_KEY (state, lastTimeKey) {
    state.lastTimeKey = lastTimeKey
    console.log('STATE.lastTimeKey', state.lastTimeKey)
  },

  CONFIRM_SUB_TOKEN_FILTER (state, subToken) {
    state.subToken = subToken
    state.subTokens.push(subToken)
  },

  SET_SUB_TOKEN_RESULT (state, result) {
    state.subTokenResults[result.subToken] = result
  }
  
}

const store = new Vuex.Store({
  state, // SHORT for 'state: state'
  mutations
})

export default store
