<template>
  <table class="table">
    <thead>
      <tr>
        <th>Used with <strong>"{{ getQueryToken }}"</strong> from <strong>{{ getFormattedStart }}</strong> to <strong>{{ getFormattedEnd }}</strong></th>
        <th># Tweets</th>
        <!--<th>Add Filter</th>-->
        <th>Add to Graph</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in collection | limit 130">
        <td><a style="padding:0;justify-content:initial" href="#" :style="{color: isActive(row.token)}"> {{ row.token | truncate 25 '...' }}</a></td>
        <td><a style="padding:0;justify-content:initial" href="#">{{ row.tweetCount }}</a></td>
        <!--<td class="is-icon">
          <a style="padding:3px;justify-content:initial" href="#"><i class="fa fa-plus" style="font-size:8px" :class="{'red': isActive(row.token)}"></i><i class="fa fa-filter" :class="{'red': isActive(row.token)}"></i></a>
        </td>-->
        <td class="is-icon">
          <a @click="addGraph(row.token, $event)" style="padding:3px;justify-content:initial" href="#"><i class="fa fa-plus" style="font-size:8px" :class="{'red': isActive(row.token)}"></i><i class="fa fa-line-chart" :class="{'red': isActive(row.token)}"></i></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {
  addGraph
} from '../vuex/actions'
import {
  getSubTokens,
  getQueryToken,
  getFormattedStart,
  getFormattedEnd
} from '../vuex/getters'

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
  },

  vuex: {
    getters: {
      getSubTokens,
      getQueryToken,
      getFormattedStart,
      getFormattedEnd
    },
    actions: {
      addGraph
    }
  },

  methods: {
    isActive (token) {
      let subTokens = this.getSubTokens
      return subTokens.indexOf(token) !== -1
    }
  }

}
</script>

<style lang="scss">
td, th {
  font-size: 14px;
}

.red {
  color: red;
}
</style>
