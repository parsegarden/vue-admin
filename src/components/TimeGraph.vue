<template>
  <div id="graph" :width="width" :height="height"></div>
</template>

<script>
import * as D3 from 'd3'
import moment from 'moment'

console.log('D3', D3)

export default {

  props: {
    width: Number,
    height: Number,
    data: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    }
  },

  ready () {
    console.log('TIME GRAPH DATA', this.data)

    const $el = this.$el
    console.log('$el', $el)
    console.log('D3', D3)
    console.log('moment', moment)

    let months = []
    let monthFormat = D3.timeFormat('%Y-%m')
    let cities = []
    let timeGraph = this.data['timeGraph']
    for (let i in timeGraph) {
      cities.push(createGraphNode(i, timeGraph[i]))
    }
    console.log('monthFormat', monthFormat)
    console.log('cities', cities)

    const graphWidth = 800
    const graphHeight = 400
    let margin = {top: 20, right: 30, bottom: 30, left: 40}
    let width = graphWidth - margin.left - margin.right
    let height = graphHeight - margin.top - margin.bottom

    let x = D3.scaleTime().range([0, width])
    let y = D3.scaleLinear().range([height, 0])

    let voronoi = D3.voronoi()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
      .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]])
    console.log(voronoi)

    let line = D3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
    console.log(line)

    let svg = D3.select('#graph').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    console.log(svg)

    console.log('MONTHS', months)
    x.domain(D3.extent(months))
    y.domain([0, D3.max(cities, function (c) { return D3.max(c.values, function (d) { return d.value }) })]).nice()

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(D3.axisBottom(x).ticks(D3.timeHour.every(2)))

    svg.selectAll('.tick > text')
      .attr('y', 20)
      .style('font-size', '12')

    svg.append('g')
        .attr('class', 'axis axis--y')
        .call(D3.axisLeft(y))
      .append('text')
       .attr('x', 9)
       .attr('y', 0.5)
       .attr('dy', '.32em')
       .style('text-anchor', 'start')
       .style('fill', '#000')
       .style('font-weight', 'bold')
       .style('font-size', '12')
       .text('# of Tweets')

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

    focus.append('text')
      .attr('y', -10)
      .attr('x', -60)

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
      d = d.data
      D3.select(d.city.line).classed('city--hover', true)
      // MOVE line to front
      d.city.line.parentNode.appendChild(d.city.line)
      focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.value) + ')')
      focus.select('text')
        .attr('transform', 'translate(-15,-10)')
        .text(d.city.name + ' (' + d.value + ' tweets) ' + moment(d.date).format('LT'))
      // console.log('GRAPH', 'tweetIds =>', d.tweetIds);
    }

    function mouseout (d) {
      d = d.data
      D3.select(d.city.line).classed('city--hover', false)
      focus.attr('transform', 'translate(-100,-100)')
    }

    function createGraphNode (name, datum) {
      console.log('createGraphNode', name, datum)

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
      console.log('createGraphNode', city)

      return city
    }

    /*
    function type (d, i) {
      // console.log('type', d, i)
      if (!i) months = Object.keys(d).map(monthFormat.parse).filter(Number)
      var city = {
        name: d.name.replace(/ (msa|necta div|met necta|met div)$/i, ''),
        values: null
      }
      city.values = months.map(function (m) {
        // console.log('type', m, d[monthFormat(m)]);
        return {
          city: city,
          date: m,
          value: d[monthFormat(m)] / 100
        }
      })
      console.log('type', city)
      return city
    }
    */
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
