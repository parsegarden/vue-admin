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
  
  console.log('mergeResults', mergedResult.query, newResult.query, mergedResult.totalCount, newResult.totalCount)

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
  console.log('mergeResults', 'outWords', outWords)
  console.log('mergeResults', 'outWords.length', outWords.length)

  // TIMEGRAPH 
  //console.log('mergeResults', 'newResult.timeGraph[newResult.query]', newResult.timeGraph[newResult.query])
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
  //console.log('mergeResults', 'totalCount', totalCount, 'timeSlices', Object.keys(outTimeGraph).length, 'lastTimeKey', lastTimeKey)
  console.log('mergeResults', 'outTimeGraph', outTimeGraph)
  console.log('mergeResults', 'outTimeGraph.length', Object.keys(outTimeGraph).length)
    
  let outObj = {}

  outTweets.sort(function (a, b) {
   return ((b.retweetCount * 3) + b.favoriteCount) - ((a.retweetCount * 3) + a.favoriteCount)
  })
  console.log('outWords[0]', outWords[0])
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
  outObj.totalCount = newResult.totalCount

  console.log('mergeResults', outObj)
  return outObj

}

function urlParam(name) {
  var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(window.location.href);
  return results[1] || 0;
}

function userActionFn({ dispatch, state, type, token, verifier }) {

  console.log('USER_ACTION', type, 'REQUEST')

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

}

function queryFn ({ dispatch, state, lastKey }) {

  //console.log('QUERY', 'REQUEST', lastKey)

  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://sc901zcfbj.execute-api.us-west-2.amazonaws.com/dev/PerformActiveQuery')
  xhr.onload = function () {
    let parsed = JSON.parse(xhr.responseText)
    console.log('performQuery', 'onload', 'RESPONSE', parsed)
    console.log('performQuery', 'onload', 'count', parsed.count,'timeGraph.length', Object.keys(parsed.timeGraph[state.queryToken]).length)

    if (parsed.lastEvaluatedKey) {
      let newLastkey = parsed.lastEvaluatedKey
      console.log('performQuery', 'onload', 'lastEvaluatedKey', newLastkey)
      queryFn({ dispatch, state, lastKey: newLastkey })
    }

    if (parsed.subToken.length > 0) {
      for (let i in parsed.tweets) {
        // console.log(parsed.tweets[i].rawText)
      }
      dispatch('SET_SUB_TOKEN_RESULT', parsed)
      dispatch('INCREMENT')
    } else {
      let outMergedResults = mergeResults({ mergedResult: state.queryResult, newResult: parsed })
      dispatch('SET_QUERY_RESULT', outMergedResults)
      dispatch('SET_LAST_TIME_KEY', outMergedResults.lastTimeKey)
      dispatch('INCREMENT')
    }
  }

  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  let obj = { query: state.queryToken, start: state.start, end: state.end, lastEvaluatedKey: lastKey }
  if (state.subToken.length > 0) {
    obj.subToken = state.subToken
  }
  console.log('QUERY', 'REQUEST', obj)
  let queryStr = JSON.stringify(obj)

  xhr.send(queryStr)

}

export const performRequestTokenAction = function ({ dispatch, state }) {
  console.log('performRequestTokenAction')

  let type = 'request_token'
  let token = ''
  let verifier = ''
  userActionFn({ dispatch, state, type, token, verifier })
}

export const performAuthTokenAction = function ({ dispatch, state }) {
  console.log('performAuthTokenAction')

  let type = 'auth_token'
  let token = urlParam('oauth_token')
  let verifier = urlParam('oauth_verifier')
  userActionFn({ dispatch, state, type, token, verifier })
}

export const performQuery = function ({ dispatch, state }) {
  dispatch('START_DRAW')

  console.log('performQuery', 'FROM', new Date(state.start*1000), 'TO', new Date(state.end*1000))

  let lastKey = ''
  queryFn({ dispatch, state, lastKey })
}

export const finishDraw = function({ dispatch, state }) {
  console.log('finishDraw')
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
export const addGraph = function ({ dispatch, state }, subToken, ev) {
  ev.preventDefault()
  dispatch('CONFIRM_SUB_TOKEN_FILTER', subToken)
}
