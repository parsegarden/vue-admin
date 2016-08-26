import Vue from 'vue'
import Vuex from 'vuex'

import config from '../config'

const { menu } = config

Vue.use(Vuex)

let now = Math.round(new Date().getTime()/1000)
const state = {
  menu, // SHORT for 'menu: menu
  queryToken: 'hillary',
  queryResult: {},
  start: now - 100000,
  end: now,
  graphWidth: 800,
  graphHeight: 550,
  drawCount: 0,
  loadStatus: true
}

const mutations = {
  // A mutation receives the current state as the first argument
  // You can make any modifications you want inside this function

  RESIZE (state) {
    state.graphWidth = document.getElementById('graph').clientWidth
    state.graphHeight = document.getElementById('graph').clientHeight
  },

  INCREMENT (state) {
    state.drawCount = state.drawCount + 1
  },

  SET_QUERY_RESULT (state, result) {
    state.queryResult = result
    console.log('STATE.queryResult.count', state.queryResult.count)
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
    console.log('STATE.start', state.start)
    console.log('STATE.end', state.end)
  },

  SET_START (state, start) {
    state.start = start
    console.log('STATE.start', state.start)
  },

  SET_END (state, end) {
    state.end = end
    console.log('STATE.end', state.end)
  }
}

const store = new Vuex.Store({
  state, // SHORT for 'state: state'
  mutations
})

export default store
