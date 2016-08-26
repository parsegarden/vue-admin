<template>
  <div id="graph"></div>
</template>

<script>
import { getQueryResult } from '../vuex/getters'
import { resize, finishDraw } from '../vuex/actions'

import * as D3 from 'd3'
import moment from 'moment'

let maxHeight = 350
let delta = 200

export default {

  props: {
    rtime: Number,
    timeout: Boolean,
    width: Number,
    height: Number,
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
      getQueryResult
    }
  },

  watch: {
    'width': 'tryDraw',
    'height': 'tryDraw',
    'count': 'tryDraw'
  },

  ready () {
    let self = this
    window.addEventListener('resize', function () {
      if (self.getQueryResult !== null && self.getQueryResult.count > 0) {
        self.resize()
      }
    })
    this.resize()
  },

  methods: {
    tryDraw () {
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
        this.drawGraph(this.getQueryResult)
      }
    },
    clearGraph () {
      let margin = {top: 20, right: 55, bottom: 30, left: 40}
      D3.select('#graph').html('')
      D3.select('#graph').append('svg')
      .attr('width', this.width + margin.left + margin.right - 45)
      .attr('height', maxHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    },
    drawGraph (data) {
      console.log('drawGraph', this.width, this.height)

      let margin = {top: 20, right: 55, bottom: 30, left: 40}
      let actualWidth = this.width - margin.left - margin.right
      let actualHeight = maxHeight

      D3.select('#graph').html('')
      let svg = D3.select('#graph').append('svg')
      .attr('width', actualWidth + margin.left + margin.right - 45)
      .attr('height', actualHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      if (data === null || data['timeGraph'] === null) {
        return
      }

      let months = []
      let cities = []
      let timeGraph = data['timeGraph']

      if (timeGraph == null) {
        return
      }

      for (let i in timeGraph) {
        cities.push(createGraphNode(i, timeGraph[i]))
      }

      let x = D3.scaleTime().range([0, actualWidth])
      let y = D3.scaleLinear().range([actualHeight, 0])

      let voronoi = D3.voronoi()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
      .extent([[-margin.left, -margin.top], [actualWidth + margin.right, actualHeight + margin.bottom]])
      // console.log(voronoi)

      let line = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
      // console.log(line)

      // console.log('MONTHS', months)
      x.domain(D3.extent(months))
      y.domain([0, D3.max(cities, function (c) { return D3.max(c.values, function (d) { return d.value }) })])

      let tickEvery = Math.floor(months.length / 3)
      console.log('tickEvery', tickEvery)
      svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + actualHeight + ')')
      .call(D3.axisBottom(x).ticks(D3.timeHour.every(tickEvery)).tickFormat(D3.timeFormat('%a %I%p')))

      svg.selectAll('.tick > text')
      .attr('y', 20)

      svg.append('g')
      .attr('class', 'axis axis--y')
      .call(D3.axisLeft(y))
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
        if (coords[0] > 70) {
          foreignObject.attr('transform', 'translate(-60,-10)')
        } else {
          foreignObject.attr('transform', 'translate(70,-10)')
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

        if (!months || months.length === 0) months = Object.keys(datum).map(function (timestamp) { return new Date(timestamp * 1000) })

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
