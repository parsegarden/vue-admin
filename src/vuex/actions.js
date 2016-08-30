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

function mergeResults ({ mergedResult, newResult }) {
  
  console.log('mergeResults', mergedResult.query, newResult.query)

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
  console.log('mergeResults', 'newResult.words', newResult.words)
  newResult.words.forEach(function (el, idx, arr) {
    if (wordLookup[el.token] !== undefined) {
      let mergedWord = wordLookup[el.token]  
      mergedWord.tweetCount +=  el.tweetCount
      mergedWord.retweetCount +=  el.retweetCount
      mergedWord.favoriteCount +=  el.favoriteCount
      mergedWord.timestamp.concat(el.timestamp)
      outWords.push(mergedWord)
    } else {
      outWords.push(el)
    }
  })

  // TIMEGRAPH 
  console.log('mergeResults', 'newResult.timeGraph[newResult.query]', newResult.timeGraph[newResult.query])
  let outTimeGraph = newResult.timeGraph[newResult.query]
  if (mergedResult.timeGraph !== undefined) { 
    outTimeGraph = Object.assign(mergedResult.timeGraph[newResult.query], newResult.timeGraph[newResult.query])
  }
  let totalCount = 0
  for (var key in outTimeGraph) {
    totalCount += outTimeGraph[key].length
  }
  console.log('mergeResults', 'totalCount', totalCount, 'timeSlices', Object.keys(outTimeGraph).length)
    
  let outObj = {}

  outTweets.sort(function (a, b) {
   return ((b.retweetCount * 3) + b.favoriteCount) - ((a.retweetCount * 3) + a.favoriteCount)
  })
  outWords = outWords.filter(function (val) {
    if (val.tweetCount < totalCount / 4 && 
      val.timestamp.length < Object.keys(outTimeGraph).length / 2 && 
      val.timestamp.length > 1) 
    {
      console.log(val.token, val.timestamp.length)
      return true
    } else {
      return false
    }
  })
  outWords.sort(function (a, b) {
   return (b.timestamp.length + b.tweetCount) - (a.timestamp.length + a.tweetCount)
  })

  outObj.tweets = outTweets
  outObj.words = outWords
  outObj.timeGraph = {}
  outObj.timeGraph[newResult.query] = outTimeGraph

  console.log('mergeResults', outObj)
  return outObj

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

    dispatch('SET_QUERY_RESULT', mergeResults({ mergedResult: state.queryResult, newResult: parsed }))
    dispatch('INCREMENT')
  }

  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  let obj = { query: state.queryToken, start: state.start, end: state.end, lastEvaluatedKey: lastKey }
  console.log('QUERY', obj)
  let queryStr = JSON.stringify(obj)

  xhr.send(queryStr)

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
