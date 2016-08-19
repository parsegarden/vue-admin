// An action will receive the store as the first argument.
// Since we are only interested in the dispatch (and optionally the state)
// we can pull those two parameters using the ES6 destructuring feature

export const resize = function ({ dispatch, state }) {
  dispatch('RESIZE')
}

export const incrementDrawCount = function ({ dispatch, state }) {
  dispatch('INCREMENT')
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

  console.log('performQuery', queryStr)
}
