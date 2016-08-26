<template>
  <div id="app">
    <navbar></navbar>
    <section class="app-main">
      <div class="container is-fluid is-marginless app-content">
      <view></view>
        <!--<router-view
          class="animated"
          transition="fade"
          transition-mode="out-in"
          keep-alive>
        </router-view>-->
      </div>
    </section>
  </div>
</template>

<script>
import store from './vuex/store'
import { performQuery } from './vuex/actions'
import Navbar from './components/Navbar'
import View from './components/pages/Dashboard/index'

export default {
  store,

  components: {
    Navbar,
    View
  },

  vuex: {
    actions: {
      performQuery
    }
  },

  ready () {
    this.performQuery()
  }
}
</script>

<style lang="scss">
@import 'scss/app';

.app-main {
  padding-top: 120px;
  //margin-left: 180px;
  transform: translate3d(0, 0, 0);

  @include mobile() {
    margin-left: 0;
  }

}

.app-content {
  padding: 20px;
}

.animated {
  animation-duration: .377s;
}
</style>
