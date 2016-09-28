import Vue from 'vue'
import Vuex from 'vuex'

import config from '../config'
import stopList from './stopList'

console.log('vuex/store.js')

const { menu } = config

Vue.use(Vuex)

let now = Math.round(new Date().getTime()/1000)
const state = {
  menu, // SHORT for 'menu: menu
  queryToken: 'hillary',
  queryResult: {
    totalCount: 35000000,
    timeGraphTweets: {}
  },
  start: now - 100000,
  end: now,
  drawCount: 0,
  loadStatus: true,
  lastEvaluatedKey: '',
  lastTimeKey: 0,
  subToken: '',
  subTokenResults: {},
  subTokens: {},
  selectedTimestamp: 0,
  timestamps: {},
  stopList
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
    state.subToken = ''
    state.subTokens = {}
    state.subTokenResults = {}
    state.queryToken = queryStr
    state.selectedTimestamp = 0
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

  REMOVE_SUB_TOKEN_FILTER (state, subToken) {
    Vue.delete(state.subTokens, subToken)
  },

  CONFIRM_SUB_TOKEN_FILTER (state, subToken) {
    // console.log('INVOKE', 'CONFIRM_SUB_TOKEN_FILTER', subToken)
    state.subToken = subToken
    Vue.set(state.subTokens, subToken, true)
  },

  CONFIRM_SUB_TOKEN_TOGGLE (state, subToken) {
    Vue.set(state.subTokens, subToken, !state.subTokens[subToken])
    console.log('INVOKE', 'CONFIRM_SUB_TOKEN_TOGGLE', state.subTokens)
  },

  SET_SUB_TOKEN_RESULT (state, result) {
    console.log('INVOKE', 'SET_SUB_TOKEN_RESULT', result)
    Vue.set(state.subTokenResults, result.subToken, result)
  },

  CONFIRM_SELECTED_TIMESTAMP_FILTER (state, selectedTimestamp) {
    console.log('INVOKE', 'CONFIRM_SINGLE_TIME_SELECT', selectedTimestamp)
    state.selectedTimestamp = selectedTimestamp
    Vue.set(state.timestamps, selectedTimestamp, true)
  },

  CONFIRM_TIMESTAMP_TOGGLE (state, timestamp) {
    Vue.set(state.timestamps, timestamp, !state.timestamps[timestamp])
    console.log('INVOKE', 'CONFIRM_TIMESTAMP_TOGGLE', state.timestamps)
  },

  SET_SELECTED_TIMESTAMP_RESULT (state, result) {
    console.log('INVOKE', 'SET_SELECTED_TIMESTAMP_RESULT', result.query, result.selectedTimestamp, state.queryResult.timeGraphTweets)
    if (state.queryResult.timeGraphTweets[result.query] === undefined) {
      Vue.set(state.queryResult.timeGraphTweets, result.query, {})
    }
    Vue.set(state.queryResult.timeGraphTweets[result.query], result.selectedTimestamp, result)
    console.log('INVOKE', 'SET_SELECTED_TIMESTAMP_RESULT', state.queryResult)
  }
  
}

const store = new Vuex.Store({
  state, // SHORT for 'state: state'
  mutations
})

export default store
