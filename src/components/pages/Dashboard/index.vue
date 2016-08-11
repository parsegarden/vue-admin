<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child box light">
          <p class="title white">New to Parsegarden?</p>
          <p class="content white">Sign up now to analyze and compare Twitter trends</p>
          <p class="control">
            <a class="button is-medium is-info" href="#">Sign up</a>
          </p>
        </article>
        <article class="tile is-child box">
          <p class="title">Track Trends</p>
          <p class="content">Track any set of Twitter queries automatically</p>
        </article>
        <article class="tile is-child box">
          <p class="title">Find Patterns</p>
          <p class="content">Explore the common language and hashtags used, influential users, and most engaging tweets over various time ranges</p>
        </article>
      </div>

      <div class="tile is-parent is-9">
        <article class="tile is-child box">
          <div class="content">
            <time-graph :data="graphData"></time-graph>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">Five</h4>
          <div class="content">
            <chart :type="'doughnut'" :data="chartData"></chart>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <h4 class="title">Six</h4>
          <div class="content">
            <chart :type="'pie'" :data="chartData"></chart>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-vertical is-9">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Seven</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
          <div class="tile is-8 is-parent">
            <article class="tile is-child box">
              <p class="title">Eight</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
        </div>
        <div class="tile">
          <div class="tile is-8 is-parent">
            <article class="tile is-child box">
              <p class="title">Nine</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title">Ten</p>
              <p class="subtitle">Subtitle</p>
              <div class="content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <p class="title">Eleven</p>
            <p class="subtitle">Subtitle</p>
            <div class="content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'vue-bulma-chartjs'
import TimeGraph from 'components/TimeGraph'
import testData from '../../../../testData'

console.log('DATA', testData)

export default {
  components: {
    Chart,
    TimeGraph
  },

  data () {
    return {
      data: [300, 50, 100]
    }
  },

  computed: {
    graphData () {
      return testData
    },
    chartData () {
      return {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
      }
    }
  }

  /*
  created () {
    setInterval(() => {
      // https://vuejs.org/guide/list.html#Mutation-Methods
      // this.data.unshift(this.data.pop())
      this.data.forEach((item, i) => {
        this.data.$set(i, Math.ceil(Math.random() * 1000))
      })
    }, 1024)
  }
  */
}
</script>

<style lang="scss" scoped>
.white {
  color: white;
}

.light {
  background: #3B6BA2;
}
</style>
