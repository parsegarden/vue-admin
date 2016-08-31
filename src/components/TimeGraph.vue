<template>
  <div id="graph"></div>
</template>

<script>
import { getQueryResult, getDrawCount } from '../vuex/getters'
import { resize, finishDraw } from '../vuex/actions'

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
      resize,
      finishDraw
    },
    getters: {
      getQueryResult,
      getDrawCount
    }
  },

  ready () {
    this.$store.watch(getDrawCount, this.drawGraph)

    let self = this
    window.addEventListener('resize', function () {
      if (self.getQueryResult !== null && Object.keys(self.getQueryResult).length > 0) {
        // DISPATCH RESIZE
        self.resize()
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

      let currentWidth = document.getElementById('graph').clientWidth + 20

      let actualWidth = currentWidth - margin.left - margin.right
      let actualHeight = maxHeight + 80

      console.log('drawGraph', actualWidth, actualHeight)

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
        console.log('drawGraph', 'EMPTY')
        return
      }

      let cities = []
      let months = []
      for (let i in timeGraph) {
        cities.push(createGraphNode(i, timeGraph[i]))
        months = Object.keys(timeGraph[i]).map(function (timestamp) {
          return timestamp
        })
      }
      let totalCount = 0
      cities[0].values.forEach(function (el, idx, arr) {
        totalCount += el.value
      })
      console.log('drawGraph', 'totalCount', totalCount)

      let x = D3.scaleTime().range([0, actualWidth + 30])
      let y = D3.scaleLinear().range([actualHeight, 0])

      let voronoi = D3.voronoi()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
      .extent([[-margin.left, -margin.top], [actualWidth + margin.right, actualHeight + margin.bottom]])

      let line = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })

      let xAxis = D3.axisBottom(x)
      let yAxis = D3.axisLeft(y).ticks(6).tickSize(0)

      // console.log('MONTHS', months, D3.extent(months))
      let timeRange = D3.extent(months)
      x.domain([new Date(timeRange[0] * 1000), new Date(timeRange[timeRange.length - 1] * 1000)])
      y.domain([0, D3.max(cities, function (c) { return D3.max(c.values, function (d) { return d.value }) })])

      svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + actualHeight + ')')
      .call(xAxis)

      svg.selectAll('.tick > text')
      .attr('y', 20)

      svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis)
      /*
      .append('text')
      .attr('x', -35)
      .attr('y', -15)
      .attr('dy', '.32em')
      .style('text-anchor', 'start')
      .style('fill', '#000')
      .style('font-weight', 'bold')
      .style('font-size', '12')
      .text('# of Tweets')
      */

      svg.selectAll('.tick > text')
      .style('font-size', '12')

      svg.append('g')
      .attr('class', 'cities')
      .selectAll('path')
      .data(cities)
      .enter().append('path')
      .attr('d', function (d) { d.line = this; return line(d.values) })

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

      voronoiGroup.selectAll('path')
      .data(voronoi.polygons(D3.merge(cities.map(function (d) { return d.values }))))
      // .key(function (d) { return x(d.date) + ',' + y(d.value) })
      // .rollup(function (v) { return v[0] })
      // .entries(D3.merge(cities.map(function (d) { return d.values })))
      // .map(function (d) { return d.values })))
      .enter().append('path')
      .attr('d', function (d) { return 'M' + d.join('L') + 'Z' })
      // .datum(function (d) { return d.point })
      .on('click', click)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)

      function click (d) {
        console.log('GRAPH', 'click =>', d.tweetIds)
        // performTweetIdsSearch(d.tweetIds)
        this.modalTitle = moment(d.date).format('LLL')
      }

      function mouseover (d) {
        // console.log('mouseover', d[0][0], d[0][1], d)
        let coords = d[0]
        d = d.data
        D3.select(d.city.line).classed('city--hover', true)
        // MOVE line to front
        d.city.line.parentNode.appendChild(d.city.line)
        focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')')
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
        // console.log('createGraphNode', name, datum)

        var city = {
          name: name,
          values: null
        }
        city.values = Object.keys(datum).map(function (m) {
          // console.log('type', m, datum[m].length);
          return {
            city: city,
            tweetIds: datum[m],
            date: new Date(m * 1000),
            value: datum[m].length
          }
        })
        // console.log('createGraphNode', city)

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
