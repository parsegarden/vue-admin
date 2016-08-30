// This getter is function which just returns the count
// With ES6 you can also write it as:
// export const getCount = state => state.count
import moment from 'moment'

export const getGraphWidth = state => state.graphWidth
export const getGraphHeight = state => state.graphHeight

export function getDrawCount (state) {
  console.log('getDrawCount')
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

export const getEnd = state => state.end

export function getQueryToken (state) {
  return state.queryToken
}

export function getQueryResult (state) {
  return state.queryResult
}

export function getLoadStatus (state) {
  return state.loadStatus
}
