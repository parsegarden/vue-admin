<template>
  <div class="tile is-parent">

    <article class="tile is-child box">
      <tabs size="medium" type="boxed">
        <tab-pane label="Tweets"></tab-pane>
      </tabs>

      <!--<h4 class="title">{{ title }}</h4>-->
      <div class="box" v-for="row in collection">
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
                <strong>{{{ '@'+row.screenName | tweetify }}}</strong> <!--<small>-->{{ row.timestamp | timify }}<!--</small>-->
                <br>
                {{{ row.rawText | tweetify }}}
              </div>
            </div>
            <nav class="level">
              <div class="level-left">
                <!--<a class="level-item">
                  <span class="icon is-small"><i class="fa fa-reply"></i></span>
                </a>-->
                <a class="level-item" :href="row | linkify" target="_blank">
                  {{ row.retweetCount }} 
                  <span class="icon is-small"><i class="fa fa-retweet"></i></span>
                </a>
                <a class="level-item" :href="row | linkify" target="_blank">
                  {{ row.favoriteCount }} 
                  <span class="icon is-small"><i class="fa fa-heart"></i></span>
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
import { Tabs, TabPane } from 'vue-bulma-tabs'

export default {
  components: {
    Tabs,
    TabPane
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
</style>
