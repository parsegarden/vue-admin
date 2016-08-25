<template>
  <div class="tile is-parent">

    <article class="tile is-child box">
      <h4 class="title">{{ title }}</h4>
      <div class="box" v-for="row in collection">
        <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              <img src="http://placehold.it/128x128" alt="Image">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <!--<strong>John Smith</strong>--> <strong>@{{ row.screenName }}</strong> <small>31m</small>
                <br>
                {{ row.rawText }}
              </p>
            </div>
            <nav class="level">
              <div class="level-left">
                <!--<a class="level-item">
                  <span class="icon is-small"><i class="fa fa-reply"></i></span>
                </a>-->
                <a class="level-item">
                  {{ row.retweetCount }} 
                  <span class="icon is-small"><i class="fa fa-retweet"></i></span>
                </a>
                <a class="level-item">
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
export default {
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
</style>
