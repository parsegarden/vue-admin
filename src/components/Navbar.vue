<template>
  <section class="hero is-bold app-navbar">
    <div class="hero-head">
      <nav class="nav dark">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet touchable sidebar-toggle" @click="toggleSidebar">
            <span class="icon">
              <i class="fa fa-bars" aria-hidden="true"></i>
            </span>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand touchable" href="#" style="width:222px">
            <img src="../assets/parsegarden.svg" style="max-height:24px">
            <div class="is-hidden-mobile">
              <p class="title is-3"><span class="vue">Parse</span><strong class="admin orange">garden</strong></p>
            </div>
          </a>
        </div>
        <div class="nav-right is-flex">
          <p class="control nav-item">
            <a class="button is-medium is-primary" href="#">Login</a>
          </p>
        </div>
      </nav>
      <nav class="nav">
        <div class="nav-center">
          <div class="nav-item hero-brand touchable">
            <div class="control is-grouped">
              <div class="control is-horizontal">
                <mz-datepicker format="M/d/yy" :start-time="getMilliStart" :end-time="getMilliEnd" range en confirm :on-confirm="confirmTimeRange"></mz-datepicker> 
              </div>
              <div class="control has-addons">
                <input class="input" type="text" placeholder="Track a word" value="hillary" v-model='queryStr'>
                <a id="searchBtn" class="button is-medium is-info" @click='triggerQuery'>Track a Word</a>
              </div>
              <div class="control is-horizontal">
                <a class="button is-medium">Demo query</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import {
  performQuery,
  updateQuery,
  clearQuery,
  confirmTimeRange
} from '../vuex/actions'
import {
  getMilliStart,
  getMilliEnd
} from '../vuex/getters'

import MzDatepicker from '../lib/VueDatepicker'

export default {
  data: function () {
    return {
      queryStr: ''
    }
  },

  vuex: {
    getters: {
      sidebar: state => state.sidebar,
      getMilliStart,
      getMilliEnd
    },
    actions: {
      updateQuery,
      triggerQuery: function () {
        console.log('triggerQuery', this.queryStr)
        this.updateQuery(this.queryStr)
      },
      clearQuery,
      performQuery,
      confirmTimeRange
    }
  },

  methods: {
    toggleSidebar () {
      this.sidebar.opened = !this.sidebar.opened
    }
  },

  components: {
    MzDatepicker
  },

  ready () {
    let self = this
    this.$store.watch(getMilliStart, function (start) {
      console.log('WATCH getFormattedStart', start)
      // DISPATCH CLEAR_QUERY_RESULT
      self.clearQuery()
      // DISPATCH START_DRAW
      self.performQuery()
    })
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

input[type=text] {
  font-size: 22px;
  height: 40px;
}

#searchBtn {
  height: 40px;
}

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }

  .sidebar-toggle {
    &:hover {
      background: $grey-lighter;
    }
  }
}

.hero-brand {
  // text-indent: -3000px;
  .vue {
    margin-left: 10px;
    // color: #36AC70;
    color: #ffffff;
  }
  .admin {
    color: #ffffff;
  }
  .orange {
    color: #FF9800;
  }
}

.nav.dark {
  background: #0A294F;
}
</style>
