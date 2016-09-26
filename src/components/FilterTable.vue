<template>
  <table class="table">
    <thead>
      <tr>
        <th>Used with <strong style="color:blue">"{{ getQueryToken }}"</strong> from <strong>{{ getFormattedStart }}</strong> to <strong>{{ getFormattedEnd }}</strong></th>
        <th># Tweets</th>
        <!--<th>Add Filter</th>-->
        <th>Add / Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in collection | limit 130">
        <td><a style="padding:0;justify-content:initial" href="#" :class="{'red': isActive(row.subToken)}"> {{ row.subToken | truncate 25 '...' }}</a></td>
        <td><a style="padding:0;justify-content:initial" href="#" :class="{'red': isActive(row.subToken)}">{{ row.tweetCount }}</a></td>
        <!--<td class="is-icon">
          <a style="padding:3px;justify-content:initial" href="#"><i class="fa fa-plus" style="font-size:8px" :class="{'red': isActive(row.subToken)}"></i><i class="fa fa-filter" :class="{'red': isActive(row.subToken)}"></i></a>
        </td>-->
        <td class="is-icon">
          <a @click="modifySubTokens(row.subToken, $event)" style="padding:3px;justify-content:initial" href="#"><i class="fa" style="font-size:8px" :class="{'red': isActive(row.subToken), 'fa-plus': !isActive(row.subToken), 'fa-minus': isActive(row.subToken)}"></i><i class="fa fa-line-chart" :class="{'red': isActive(row.subToken)}"></i></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {
  modifySubTokens
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
      modifySubTokens
    }
  },

  methods: {
    isActive (token) {
      // console.log('INVOKE', 'FilterTable', 'isActive', token)
      let subTokens = Object.keys(this.getSubTokens)
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
  color: red !important;
}
</style>
