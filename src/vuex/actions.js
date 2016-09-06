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
      wordLookup[el.token] = el
    })
  }
  newResult.words.forEach(function (el, idx, arr) {
    if (wordLookup[el.token] !== undefined) {
      let mergedWord = wordLookup[el.token]  
      mergedWord.tweetCount +=  el.tweetCount
      mergedWord.retweetCount +=  el.retweetCount
      mergedWord.favoriteCount +=  el.favoriteCount
      mergedWord.timestamp[el.timestamp] = el.tweetCount
      outWords.push(mergedWord)
    } else {
      outWords.push(el)
    }
  })
  console.log('mergeResults', 'outWords.length', outWords.length)

  // TIMEGRAPH 
  console.log('mergeResults', 'newResult.timeGraph[newResult.query]', newResult.timeGraph[newResult.query])
  let outTimeGraph = newResult.timeGraph[newResult.query]
  if (mergedResult.timeGraph !== undefined) { 
    outTimeGraph = Object.assign(mergedResult.timeGraph[newResult.query], newResult.timeGraph[newResult.query])
  }
  let totalCount = 0
  let lastTimeKey 
  for (var key in outTimeGraph) {
    totalCount += outTimeGraph[key].length
    lastTimeKey = key
  }
  console.log('mergeResults', 'totalCount', totalCount, 'timeSlices', Object.keys(outTimeGraph).length, 'lastTimeKey', lastTimeKey)
    
  let outObj = {}

  outTweets.sort(function (a, b) {
   return ((b.retweetCount * 3) + b.favoriteCount) - ((a.retweetCount * 3) + a.favoriteCount)
  })
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

function userActionFn({ dispatch, state }) {

  console.log('USER_ACTION')

  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://sc901zcfbj.execute-api.us-west-2.amazonaws.com/dev/PerformUserAction')
  xhr.onload = function () {
    let parsed = JSON.parse(xhr.responseText)
    console.log('performUserAction', 'onload', 'RESPONSE', parsed)
  }
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  let obj = {  }
  let queryStr = JSON.stringify(obj)
  xhr.send(queryStr)

}

function queryFn ({ dispatch, state, lastKey }) {

  console.log('QUERY', lastKey)

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
  console.log('QUERY', obj)
  let queryStr = JSON.stringify(obj)

  xhr.send(queryStr)

}

export const performUserAction = function ({ dispatch, state }) {
  console.log('performUserAction')

  userActionFn({ dispatch, state })
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
