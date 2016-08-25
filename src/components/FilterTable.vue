<template>
  <div class="tile is-parent">

      <article class="tile is-child box">
        <h4 class="title">{{ title }}</h4>
        <table class="table">
          <!--<thead>
            <tr v-for="label in schema">
              <th>{{ label.token }}</th>
            </tr>
          </thead>-->
          <tbody>
            <tr v-for="row in collection">
              <td>{{ row.token }}</td>
              <td>{{ row.metadata }}</td>
            </tr>
          </tbody>
        </table>
      </article>

  </div>
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
</style>
