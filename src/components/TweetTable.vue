<template>
  <div class="tile is-parent">

    <article class="tile is-child box">
      <p class="title is-5" style="color: #69707a; font-weight: normal;">Popular Tweets with <strong style="color:blue">"{{ getQueryToken }}"</strong> from <strong style="color: black">{{ getFormattedStart }}</strong> to <strong style="color: black">{{ getFormattedEnd }}</strong></p>

      <filter-bar></filter-bar>

      <div class="box" style="margin-bottom:10px;padding:17px" v-for="row in collection">
        <article class="media">
          <!--<div class="media-left">
            <figure class="image is-64x64">
              <img src="http://placehold.it/128x128" alt="Image">
            </figure>
          </div>
          -->
          <div class="media-content">
            <div class="content">
              <div>
                <a class="level-item" :href="row | user" target="_blank" style="margin-right:10px">
                  <strong style="color:#1fc8db">{{{ '@'+row.screenName }}}</strong> 
                </a>
                <p class="time" style="display:inline;width:140px">{{ row.createdAtUnix | timify }}</p>
                <br>
                <p style="margin-top:4px">{{{ row.rawText | tweetify }}}</p>
              </div>
            </div>
            <nav class="level" style="margin-top:12px">
              <div class="level-left">
                <a class="level-item" :href="row | reply" target="_blank" style="margin-right:30px">
                  <span class="icon is-small" style="margin-top:2px"><i class="fa fa-reply"></i></span>
                </a>
                <a class="level-item" :href="row | retweet" target="_blank" style="margin-right:30px">
                  <span class="icon is-small" style="margin-top:1px"><i class="fa fa-retweet"></i></span>
                  {{ row.retweetCount }} 
                </a>
                <a class="level-item" :href="row | like" target="_blank" style="margin-right:30px">
                  <span class="icon is-small" style="margin-top:2px"><i class="fa fa-heart"></i></span>
                  {{ row.favoriteCount }} 
                </a>
                <a class="level-item" :href="row | linkify" target="_blank">
                  <span class="icon is-small" style="margin-top:2px"><i class="fa fa-external-link"></i></span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </article>

  </div>
</template>

<script>
import {
  getQueryToken,
  getFormattedStart,
  getFormattedEnd,
  getSubTokenResults
} from '../vuex/getters'

import { Tabs, TabPane } from 'vue-bulma-tabs'
import FilterBar from './FilterBar'

export default {

  components: {
    Tabs,
    TabPane,
    FilterBar
  },

  props: {
    title: String,
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
      getFormattedStart,
      getFormattedEnd,
      getQueryToken,
      getSubTokenResults
    },
    actions: {
    }
  }

}
</script>

<style lang="scss">
img.emoji {
  height: 1em;
  width: 1em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
}

.time:before {
  content: "\00b7";
  padding: 2px;
}
</style>
