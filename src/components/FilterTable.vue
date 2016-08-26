<template>
  <div class="tile is-parent">

      <article class="tile is-child box">
        <tabs size="medium" type="boxed">
          <tab-pane label="Language"></tab-pane>
          <tab-pane label="Hashtags"></tab-pane>
          <tab-pane label="Users"></tab-pane>
        </tabs>

        <!--<h4 class="title">{{ title }}</h4>-->
        <table class="table">
          <thead>
            <tr>
              <th>{{ label.token }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in collection">
              <td>{{ row.token | truncate 25 '...' }}</td>
              <td><a href="#">{{ row.tweetCount }}</a></td>
            </tr>
          </tbody>
        </table>
      </article>

  </div>
</template>

<script>
import { Tabs, TabPane } from 'vue-bulma-tabs'

export default {
  components: {
    Tabs,
    TabPane
  },
  props: {
    title: String,
    schema: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    collection: {
      type: Array,
      require: true,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
td {
  font-size: 16px;
}
</style>
