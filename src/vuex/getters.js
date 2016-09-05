// This getter is function which just returns the count
// With ES6 you can also write it as:
// export const getCount = state => state.count
import moment from 'moment'

export const getDrawCount = state => state.drawCount

export const getMilliStart = state => state.start * 1000
export function getFormattedStart (state) { 
  var tmpTime = new Date(state.start * 1000)
  return stringify(new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate()))
}
export const getStart = state => state.start
export const getMilliEnd = state => state.end * 1000
export function getFormattedEnd (state) {
  var tmpTime = new Date(state.end * 1000)
  return stringify(new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate()))
}
export const getEnd = state => state.end

export const getQueryToken = state => state.queryToken
export const getQueryResult = state => state.queryResult

export const getLoadStatus = state => state.loadStatus

export const getLastTimeKey = state => state.lastTimeKey 

export const getSubToken = state => state.subToken
export const getSubTokenResults = state => state.subTokenResults
export const getSubTokens = state => state.subTokens

const stringify = function (time, format) {
  if (!time) {
    return ''
  }
  format = format || 'M/d/yy'

  let year = time.getFullYear() // 年份
  let month = time.getMonth() + 1 // 月份
  let day = time.getDate() // 日
  let hours24 = time.getHours() // 小时
  let hours = hours24 % 12 === 0 ? 12 : hours24 % 12
  let minutes = time.getMinutes() // 分
  let seconds = time.getSeconds() // 秒
  let milliseconds = time.getMilliseconds() // 毫秒
  var map = {
    yy: year.toString().slice(-2),
    yyyy: year,
    MM: ('0' + month).slice(-2),
    M: month,
    dd: ('0' + day).slice(-2),
    d: day,
    HH: ('0' + hours24).slice(-2),
    H: hours24,
    hh: ('0' + hours).slice(-2),
    h: hours,
    mm: ('0' + minutes).slice(-2),
    m: minutes,
    ss: ('0' + seconds).slice(-2),
    s: seconds,
    S: milliseconds
  }
  return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+/g, function (str) {
    return map[str]
  })
}

