// An action will receive the store as the first argument.
// Since we are only interested in the dispatch (and optionally the state)
// we can pull those two parameters using the ES6 destructuring feature

export const resize = function ({ dispatch, state }) {
  dispatch('RESIZE')
}

export const incrementDrawCount = function ({ dispatch, state }) {
  dispatch('INCREMENT')
}

export const confirmTimeRange = function({ dispatch, state }, start, end) {
  console.log('confirmTimeRange', start / 1000, end / 1000)
  dispatch('CONFIRM_TIME_RANGE', start / 1000, end / 1000)
}

export const setStart = function ({ dispatch, state }, start) {
  console.log('setStart', start.getTime() / 1000)
  dispatch('SET_START', start.getTime() / 1000)
}

export const setEnd = function ({ dispatch, state }, end) {
  console.log('endStart', end.getTime() / 1000)
  dispatch('SET_END', end.getTime() / 1000)
}

export const performQuery = function ({ dispatch, state }) {
  dispatch('START_DRAW')

  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://sc901zcfbj.execute-api.us-west-2.amazonaws.com/dev/PerformActiveQuery')
  xhr.onload = function () {
    console.log('onload', JSON.parse(xhr.responseText))
    dispatch('SET_QUERY_RESULT', JSON.parse(xhr.responseText))
    dispatch('INCREMENT')
  }
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  let queryStr = JSON.stringify({ query: state.queryToken, start: state.start, end: state.end })
  xhr.send(queryStr)

  console.log('performQuery', 'start', new Date(state.start*1000), 'end', new Date(state.end*1000))
  console.log('performQuery', queryStr)
}

export const finishDraw = function({ dispatch, state }) {
  dispatch('FINISH_DRAW')
}
