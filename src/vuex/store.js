import Vue from 'vue'
import Vuex from 'vuex'

import config from '../config'

const { menu } = config

Vue.use(Vuex)

const state = {
  menu, // SHORT for 'menu: menu
  queryToken: 'hillary',
  queryResult: null,
  start: 1471200000,
  end: 1471265611,
  graphWidth: 800,
  graphHeight: 550,
  drawCount: 0
}

const mutations = {
  // A mutation receives the current state as the first argument
  // You can make any modifications you want inside this function

  RESIZE (state) {
    state.graphWidth = document.getElementById('graph').clientWidth
    state.graphHeight = document.getElementById('graph').clientHeight
    console.log('STATE', 'graphWidth', state.graphWidth, 'graphHeight', state.graphHeight)
  },

  INCREMENT (state) {
    state.drawCount = state.drawCount + 1
  },

  SET_QUERY_RESULT (state, result) {
    state.queryResult = result
    console.log('STATE.queryResult.count', state.queryResult.count)
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
