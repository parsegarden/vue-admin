<template>
  <div>
    <div class="block" style="margin-bottom:10px">
      <a class="button is-active is-danger is-outlined" style="font-size:8px;margin:0 6px 0 0"><i class="fa fa-plus" style="line-height:30px"></i><i class="fa fa-clock-o" style="font-size:21px;padding-left:6px"></i></a>
      <a @click="toggleTimestamp($event)" class="button is-danger is-active" style="margin: 0 6px 0 0">{{ getSelectedTimestamp }}</a>
      <a class="button is-active is-danger is-outlined" style="font-size:8px;margin:0 6px 0 0"><i class="fa fa-plus" style="line-height:30px"></i><i class="fa fa-line-chart" style="font-size:21px;padding-left:6px"></i></a>
      <a v-for="(idx, obj) in getSubTokens" @click="toggleSubToken(idx, $event)" class="button is-danger is-active" :class="obj ? '' : 'is-outlined'" style="margin: 0 6px 0 0">{{ idx }}</a>
    </div>
  </div>
</template>

<script>
import {
  toggleSubToken,
  toggleTimestamp
} from '../vuex/actions'

import {
  getSubTokens,
  getSelectedTimestamp
} from '../vuex/getters'

export default {
  vuex: {
    getters: {
      getSubTokens,
      getSelectedTimestamp
    },
    actions: {
      toggleSubToken,
      toggleTimestamp
    }
  }
}

</script>


