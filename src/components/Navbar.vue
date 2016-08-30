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
          <a class="nav-item hero-brand touchable" href="#">
            <!--<img src="../assets/logo.svg" alt="Vue Admin Panel Framework">-->
            <div class="is-hidden-mobile">
              <p class="title is-3"><span class="vue">Parse</span><strong class="admin">garden</strong></p>
            </div>
          </a>
        </div>
        <div class="nav-right is-flex">
          <div class="control is-grouped nav-item">
            <p class="control">
              <a class="button is-medium" href="#">Sign up</a>
            </p>
            <p class="control">
              <a class="button is-medium is-primary" href="#">Login</a>
            </p>
          </div>
        </div>
      </nav>
      <nav class="nav">
        <div class="nav-center">
          <div class="nav-item hero-brand touchable">
            <div class="control has-addons">
              <input class="input" type="text" placeholder="Track a query" value="hillary" v-model='queryStr'>
              <a id="searchBtn" class="button is-medium is-info" @click='triggerQuery'>Track Query</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import { updateQuery } from '../vuex/actions'

export default {
  data: function () {
    return {
      queryStr: ''
    }
  },

  vuex: {
    getters: {
      sidebar: state => state.sidebar
    },
    actions: {
      updateQuery,
      triggerQuery: function () {
        console.log('triggerQuery', this.queryStr)
        this.updateQuery(this.queryStr)
      }
    }
  },

  methods: {
    toggleSidebar () {
      this.sidebar.opened = !this.sidebar.opened
    }
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
    color: #FF9800;
  }
  .admin {
    color: #ffffff;
  }
}

.nav.dark {
  background: #0A294F;
}
</style>
