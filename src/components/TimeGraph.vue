<template>
  <div id="graph"></div>
</template>

<script>
import {
  getQueryResult,
  getDrawCount,
  getSubTokenResults,
  getQueryToken
} from '../vuex/getters'
import {
  incrementDrawCount,
  finishDraw
} from '../vuex/actions'

import * as D3 from 'd3'
import moment from 'moment'

let margin = {top: 20, right: 70, bottom: 20, left: 40}
let maxHeight = 200
let delta = 200

export default {

  props: {
    rtime: Number,
    timeout: Boolean,
    count: Number,
    data: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    }
  },

  vuex: {
    actions: {
      incrementDrawCount,
      finishDraw
    },
    getters: {
      getQueryResult,
      getDrawCount,
      getSubTokenResults,
      getQueryToken
    }
  },

  ready () {
    this.$store.watch(getDrawCount, this.drawGraph)

    let self = this
    window.addEventListener('resize', function () {
      if (self.getQueryResult !== null && Object.keys(self.getQueryResult).length > 0) {
        // DISPATCH RESIZE
        self.incrementDrawCount()
      }
    })
  },

  methods: {
    tryDraw () {
      console.log('tryDraw')
      this.rtime = new Date()
      if (this.timeout === false) {
        this.timeout = true
        this.clearGraph()
        setTimeout(this.timedDraw, delta)
      }
    },
    timedDraw () {
      if (new Date() - this.rtime < delta) {
        setTimeout(this.timedDraw, delta)
      } else {
        this.timeout = false
        this.drawGraph()
      }
    },
    clearGraph () {
      D3.select('#graph').html('')
      D3.select('#graph').append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', maxHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    },
    drawGraph () {
      let data = this.getQueryResult
      let subTokenData = this.getSubTokenResults

      console.log('subTokenData', subTokenData)

      let currentWidth = document.getElementById('graph').clientWidth + 20

      let actualWidth = currentWidth - margin.left - margin.right
      let actualHeight = maxHeight + 110
      // console.log('drawGraph', actualWidth, actualHeight)

      D3.select('#graph').html('')
      let svg = D3.select('#graph').append('svg')
      .attr('width', actualWidth + margin.left + margin.right)
      .attr('height', actualHeight + 50)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      if (data === null || data['timeGraph'] === null) {
        return
      }

      let timeGraph = data['timeGraph']
      if (timeGraph == null) {
        console.log('drawGraph', 'timeGraph', 'EMPTY')
        return
      }

      let graphs = []
      let timestamps = []
      let mainToken = ''
      for (let i in timeGraph) {
        console.log('drawGraph', 'token', i)
        mainToken = i
        timestamps = Object.keys(timeGraph[i]).map(function (timestamp) {
          return timestamp
        })
        graphs.push(createGraphNode(i, timeGraph[i]))

        for (let j in subTokenData) {
          console.log('drawGraph', 'subToken', j)
          let subTokenTimeGraph = subTokenData[j]['timeGraph']
          if (subTokenTimeGraph == null) {
            console.log('drawGraph', 'subTokenTimeGraph', 'EMPTY')
          }
          console.log('drawGraph', 'subTokenTimeGraph', subTokenTimeGraph)

          graphs.push(createGraphNode(j, subTokenTimeGraph[i]))
        }
      }
      let totalCount = 0
      graphs[0].values.forEach(function (el, idx, arr) {
        totalCount += el.value
      })
      console.log('drawGraph', 'totalCount', totalCount)

      console.log('drawGraph', 'graphs', graphs)

      let x = D3.scaleTime().range([0, actualWidth + 0])
      let y0 = D3.scaleLinear().range([actualHeight, 0])
      let y1 = D3.scaleLinear().range([actualHeight, 0])

      let voronoi0 = D3.voronoi()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return d.city.name === mainToken ? y0(d.value) : y1(d.alteredValue) })
      .extent([[-margin.left, -margin.top], [actualWidth + margin.right, actualHeight + margin.bottom]])

      /*
      let voronoi1 = D3.voronoi()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y1(d.value) })
      .extent([[-margin.left, -margin.top], [actualWidth + margin.right, actualHeight + margin.bottom]])
      */

      let line0 = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y0(d.value) })
      let line1 = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y1(d.value) })
      // console.log('drawGraph', 'line0', line0, 'line1', line1)

      let xAxis = D3.axisBottom(x)
      let yAxisLeft = D3.axisLeft(y0).ticks(6).tickSize(0)
      let yAxisRight = D3.axisRight(y1).ticks(6).tickSize(0)

      // console.log('MONTHS', timestamps, D3.extent(timestamps))
      let timeRange = D3.extent(timestamps)
      x.domain([new Date(timeRange[0] * 1000), new Date(timeRange[timeRange.length - 1] * 1000)])
      y0.domain([0, D3.max(graphs.slice(0, 1), function (c) { return D3.max(c.values, function (d) { return d.value }) })])
      y1.domain([0, D3.max(graphs.slice(1), function (c) { return D3.max(c.values, function (d) { return d.value }) })])

      svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + actualHeight + ')')
      .call(xAxis)

      svg.selectAll('.tick > text')
      .attr('y', 20)

      svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisLeft)

      svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(' + actualWidth + ' , 0)')
      .style('fill', 'red')
      .call(yAxisRight)

      svg.selectAll('.tick > text')
      .style('font-size', '12')

      svg.append('g')
      .attr('class', 'cities')
      .selectAll('path')
      .data(graphs.slice(0, 1))
      .enter().append('path')
      .attr('d', function (d) { d.line = this; return line0(d.values) })

      svg.append('g')
      .attr('class', 'cities')
      .selectAll('path')
      .data(graphs.slice(1))
      .enter().append('path')
      .attr('d', function (d) { d.line = this; return line1(d.values) })

      let focus = svg.append('g')
      .attr('transform', 'translate(-100,-100)')
      .attr('class', 'focus')

      focus.append('circle')
      .attr('r', 3.5)

      focus.append('foreignObject')
        .attr('width', 100)
        .attr('height', 100)
        .attr('y', -10)
        .attr('x', -60)
        .append('xhtml:body')

      let voronoiGroup = svg.append('g')
      .attr('class', 'voronoi')

      let points = D3.merge(graphs.map(function (d) { return d.values }))
      console.log('voronoi', points)
      let redundantPoints = []
      for (let i in points) {
        // console.log('voronoi', +points[i].date, points[i].value)
        points[i].alteredValue = points[i].value
        for (let j in redundantPoints) {
          if (redundantPoints[j][0] === +points[i].date && redundantPoints[j][1] === points[i].value) {
            console.log('redundant', points[i])
            points[i].alteredValue += 0.2
          }
        }
        redundantPoints.push([+points[i].date, points[i].alteredValue])
      }

      let polygons = voronoi0.polygons(points)
      console.log('voronoi', polygons.length)

      voronoiGroup.selectAll('path')
      .data(polygons)
      // .key(function (d) { return x(d.date) + ',' + y(d.value) })
      // .rollup(function (v) { return v[0] })
      // .entries(D3.merge(graphs.map(function (d) { return d.values })))
      // .map(function (d) { return d.values })))
      .enter().append('path')
      .attr('d', function (d) { return d !== undefined ? 'M' + d.join('L') + 'Z' : 'MZ' })
      .on('click', click)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)

      console.log(voronoiGroup.selectAll('.voronoi path').size())

      function click (d) {
        console.log('GRAPH', 'click =>', d.tweetIds)
        // performTweetIdsSearch(d.tweetIds)
        this.modalTitle = moment(d.date).format('LLL')
      }

      function mouseover (d) {
        // console.log('mouseover', d.data.city.name, d)
        let coords = d[0]
        d = d.data
        D3.select(d.city.line).classed('city--hover', true)
        // MOVE line to front
        d.city.line.parentNode.appendChild(d.city.line)
        if (d.city.name === mainToken) {
          focus.attr('transform', 'translate(' + x(d.date) + ',' + y0(d.value) + ')')
        } else {
          focus.attr('transform', 'translate(' + x(d.date) + ',' + y1(d.value) + ')')
        }
        let foreignObject = focus.select('foreignObject')
        if (coords[0] > 140) {
          foreignObject.attr('transform', 'translate(-60,-10)')
        } else {
          foreignObject.attr('transform', 'translate(80,-10)')
        }
        foreignObject
          .select('body')
          .attr('style', 'background: white; border: 1px solid gray; padding: 4px; border-radius: 4px')
          .html('')
        foreignObject.select('body')
          .append('p')
          .text(d.city.name)
        foreignObject.select('body')
          .append('p')
          .attr('style', 'color: black')
          .text(d.value + ' tweets')
        foreignObject.select('body')
          .append('p')
          .text(moment(d.date).format('MMM Do'))
        foreignObject.select('body')
          .append('p')
          .text(moment(d.date).format('h:mm a'))
      }

      function mouseout (d) {
        d = d.data
        D3.select(d.city.line).classed('city--hover', false)
        focus.attr('transform', 'translate(-100,-100)')
      }

      function createGraphNode (name, datum) {
        console.log('timestamps', timestamps)
        console.log('createGraphNode', name, Object.keys(datum))

        var city = {
          name: name,
          values: null
        }
        // TODO: figure out how to reconcile timestamps and graph node keys
        city.values = timestamps.map(function (m) {
          return {
            city: city,
            tweetIds: datum[m] !== undefined ? datum[m] : [],
            date: new Date(m * 1000),
            value: datum[m] !== undefined ? datum[m].length : 0
          }
        })
        console.log('createGraphNode', city.values)

        return city
      }

      this.finishDraw()
      console.log('drawGraph', 'FINISH')
    }
  }

}
</script>

<style>
/*
.axis path, .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
*/

.axis--x path, .axis--y path {
  display: none;
}

.cities {
  fill: none;
  stroke: #aaa;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 3px;
}

.city--hover {
  stroke: #000;
}

.focus text {
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}

.voronoi path {
  fill: none;
  pointer-events: all;
}

.voronoi--show path {
  stroke: red;
  stroke-opacity: .2;
}
</style>
