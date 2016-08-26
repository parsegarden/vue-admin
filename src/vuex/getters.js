// This getter is function which just returns the count
// With ES6 you can also write it as:
// export const getCount = state => state.count
import moment from 'moment'

export function getGraphWidth (state) {
  return state.graphWidth
}

export function getGraphHeight (state) {
  return state.graphHeight
}

export function getDrawCount (state) {
  return state.drawCount
}

export function getFormattedStart (state) {
  // let date = moment(new Date(state.start * 1000)).format('YYYY-MM-DD hh:mm:ss')
  return state.start * 1000
}

export function getStart (state) {
  return state.start
}

export function getFormattedEnd (state) {
  // let date = moment(new Date(state.end * 1000)).format('YYYY-MM-DD hh:mm:ss')
  return state.end * 1000
}

export function getEnd (state) {
  return state.end
}

export function getQueryResult (state) {
  return state.queryResult
}

export function getLoadStatus (state) {
  return state.loadStatus
}
