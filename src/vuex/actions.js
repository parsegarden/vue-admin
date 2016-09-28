// An action will receive the store as the first argument.
// Since we are only interested in the dispatch (and optionally the state)
// we can pull those two parameters using the ES6 destructuring feature

export const resize = function ({ dispatch, state }) {
  dispatch('INCREMENT')
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

function mergeResults ({ mergedResult, newResult }) {
  
  console.group('INVOKE', 'mergeResults', mergedResult.query, newResult.query, mergedResult.totalCount, newResult.totalCount)

  // TWEETS
  let outTweets = newResult.tweets
  if (mergedResult.tweets !== undefined) {
    outTweets = mergedResult.tweets.concat(newResult.tweets)
  }

  // WORDS
  let wordLookup = {}
  let outWords = []
  if (mergedResult.words !== undefined) {
    mergedResult.words.forEach(function (el, idx, arr) {
      wordLookup[el.subToken] = el
    })
  }
  newResult.words.forEach(function (el, idx, arr) {
    var mergedWord = {
      subToken: el.subToken,
      tweetCount: 0,
      retweetCount: 0,
      favoriteCount: 0,
      timestamp: {}
    }

    if (wordLookup[el.subToken] !== undefined) {
      mergedWord = wordLookup[el.subToken]  
    }

    for (var key in el.roundedTokenCounts) {
      mergedWord.tweetCount +=  el.roundedTokenCounts[key].tweetCount
      mergedWord.retweetCount +=  el.roundedTokenCounts[key].retweetCount
      mergedWord.favoriteCount += el.roundedTokenCounts[key].favoriteCount
      mergedWord.timestamp[key] = el.roundedTokenCounts[key].tweetCount
    }

    outWords.push(mergedWord)
  })
  // console.log('mergeResults', 'outWords', outWords)
  console.log('mergeResults', 'outWords.length', outWords.length)

  // TIMEGRAPH 
  // console.log('mergeResults', 'newResult.timeGraph[newResult.query]', newResult.timeGraph[newResult.query])
  let outTimeGraph = newResult.timeGraph[newResult.query]
  if (mergedResult.timeGraph !== undefined) { 
    outTimeGraph = Object.assign(mergedResult.timeGraph[newResult.query], newResult.timeGraph[newResult.query])
  }
  var totalCount = 0
  let lastTimeKey 
  for (var key in outTimeGraph) { 
    totalCount += outTimeGraph[key].length 
    lastTimeKey = key 
  }
  // console.log('mergeResults', 'totalCount', totalCount, 'timeSlices', Object.keys(outTimeGraph).length, 'lastTimeKey', lastTimeKey)
  // console.log('mergeResults', 'outTimeGraph', outTimeGraph)
  console.log('mergeResults', 'outTimeGraph.length', Object.keys(outTimeGraph).length)
    
  let outObj = {}

  //console.log('outWords[0]', outWords[0])
  outWords = outWords.filter(function (val) {
    if (val.tweetCount < totalCount / 4 && 
      Object.keys(val.timestamp).length < Object.keys(outTimeGraph).length / 2 && 
      Object.keys(val.timestamp).length > 1) 
    {
      // console.log(val.token, val.timestamp.length)
      return true
    } else {
      return false
    }
  })
  outWords.sort(function (a, b) {
   return (Object.keys(b.timestamp).length + b.tweetCount) - (Object.keys(a.timestamp).length + a.tweetCount)
  })

  outObj.lastTimeKey = lastTimeKey
  outObj.tweets = outTweets
  outObj.words = outWords
  outObj.timeGraph = {}
  outObj.timeGraph[newResult.query] = outTimeGraph
  outObj.timeGraphTweets = {}

  if (mergedResult.totalCount < newResult.totalCount) {
    console.log('newResult.totalCount', newResult.totalCount) 
    outObj.totalCount = newResult.totalCount
  } else {
    outObj.totalCount = mergedResult.totalCount
  }

  console.log('mergeResults', outObj)
  console.groupEnd()

  return outObj

}

function urlParam(name) {
  var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
  return results[1] || 0;
}

function userActionFn({ dispatch, state, type, token, verifier }) {

  console.group('USER_ACTION', type, 'REQUEST')

  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://sc901zcfbj.execute-api.us-west-2.amazonaws.com/dev/PerformUserAction')
  xhr.onload = function () {
    let parsed = JSON.parse(xhr.responseText)
    console.log('USER_ACTION', type, 'onload', 'RESPONSE', parsed)
    if (type === 'request_token') {
      window.location = parsed.authorizationUrl;
    }
  }
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  let obj = { type: type, token: token, verifier: verifier }
  let queryStr = JSON.stringify(obj)
  console.log('USER_ACTION', 'REQUEST', 'queryStr', queryStr)
  if (type === 'request_token') {
    xhr.send(queryStr)
  } else {
    xhr.send(queryStr)
  }

  console.groupEnd()

}

function queryFn ({ dispatch, state, lastKey }) {

  console.group('QUERY', 'REQUEST', lastKey)

  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://sc901zcfbj.execute-api.us-west-2.amazonaws.com/dev/PerformActiveQuery')
  xhr.onload = function () {
    let parsedResp = JSON.parse(xhr.responseText)
    console.log('QUERY', 'RESPONSE', parsedResp)

    if (parsedResp.lastEvaluatedKey) {
      let newLastkey = parsedResp.lastEvaluatedKey
      console.log('NEXT QUERY', 'RESPONSE', 'lastEvaluatedKey', newLastkey)
      queryFn({ dispatch, state, lastKey: newLastkey })
    }

    console.log(parsedResp.queryType, 'RESPONSE', 'count', parsedResp.count)

    switch (parsedResp.queryType) {
      case 'FULL_QUERY':
        let outMergedResults = mergeResults({ mergedResult: state.queryResult, newResult: parsedResp })
        dispatch('SET_QUERY_RESULT', outMergedResults)
        dispatch('SET_LAST_TIME_KEY', outMergedResults.lastTimeKey)
        break;
      case 'SUB_TOKEN_QUERY':
        dispatch('SET_SUB_TOKEN_RESULT', parsedResp)
        break;
      case 'TIMESTAMP_QUERY':
        dispatch('SET_SELECTED_TIMESTAMP_RESULT', parsedResp)
        break;
    }

    dispatch('INCREMENT')
  }

  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  let obj = { queryToken: state.queryToken, start: state.start, end: state.end, lastEvaluatedKey: lastKey, queryType: 'FULL_QUERY' }
  if (state.selectedTimestamp > 1000000000) {
    obj.selectedTimestamp = state.selectedTimestamp
    obj.queryType = 'TIMESTAMP_QUERY'
  } else if (state.subToken.length > 0) {
    obj.subToken = state.subToken
    obj.queryType = 'SUB_TOKEN_QUERY'
  }
  console.log('QUERY', 'REQUEST', obj)
  let queryStr = JSON.stringify(obj)

  xhr.send(queryStr)

  console.groupEnd()

}

export const performRequestTokenAction = function ({ dispatch, state }) {
  console.log('performRequestTokenAction')

  let type = 'request_token'
  let token = ''
  let verifier = ''
  userActionFn({ dispatch, state, type, token, verifier })
}

export const performAuthTokenAction = function ({ dispatch, state }) {
  console.log('INVOKE', 'performAuthTokenAction')

  let type = 'auth_token'
  let token = urlParam('oauth_token')
  let verifier = urlParam('oauth_verifier')
  userActionFn({ dispatch, state, type, token, verifier })
}

export const performQuery = function ({ dispatch, state }) {
  dispatch('START_DRAW')

  console.log('INVOKE', 'performQuery', 'FROM', new Date(state.start*1000), 'TO', new Date(state.end*1000))

  let lastKey = ''
  queryFn({ dispatch, state, lastKey })
}

export const finishDraw = function({ dispatch, state }) {
  console.log('INVOKE', 'finishDraw')
  dispatch('FINISH_DRAW')
}

export const clearQuery = function ({ dispatch, state }) {
  dispatch('CLEAR_QUERY_RESULT')
}
export const updateQuery = function ({ dispatch, state }, queryStr) {
  dispatch('CONFIRM_QUERY', queryStr)
}

export const addFilter = function ({ dispatch, state }, subToken, ev) {
}

export const modifySubTokens = function ({ dispatch, state }, subToken, ev) {
  ev.preventDefault()
  console.log('INVOKE', 'modifySubTokens', 'subToken', subToken, 'subTokens[subToken]', state.subTokens[subToken])
  if (state.subTokens[subToken] !== undefined) {
    dispatch('REMOVE_SUB_TOKEN_FILTER', subToken)
    dispatch('INCREMENT')
  } else {
    dispatch('CONFIRM_SUB_TOKEN_FILTER', subToken)
  }
}

export const toggleSubToken = function({ dispatch, state }, subToken, ev) {
  console.log('INVOKE', 'toggleSubToken', subToken)
  ev.preventDefault()
  dispatch('CONFIRM_SUB_TOKEN_TOGGLE', subToken)
  dispatch('INCREMENT')
}

export const confirmSelectedTimestamp = function({ dispatch, state }, selectedTimestamp) {
  console.log('INVOKE', 'confirmTimeSelect', typeof(selectedTimestamp))
  dispatch('CONFIRM_SELECTED_TIMESTAMP_FILTER', selectedTimestamp)
}

export const toggleTimestamp = function({ dispatch, state }, timestamp) {
  console.log('INVOKE', 'toggleSingleTimeSelect', timestamp)
  dispatch('CONFIRM_TIMESTAMP_TOGGLE', timestamp)
}
