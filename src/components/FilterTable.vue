<template>
  <table class="table">
    <thead>
      <tr>
        <th>Notable Tokens</th>
        <th># Tweets</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in collection">
        <td>{{ row.token | truncate 25 '...' }}</td>
        <td><a style="padding:0;justify-content:initial" href="#">{{ row.tweetCount }}</a></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
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
td, th {
  font-size: 14px;
}
</style>
