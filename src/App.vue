<template>
  <div id="app" :style="{width:visibleWin.length * 960 + 'px',backgroundPositionX:visibleWin.indexOf(4)>=0?'right':'left'}">
    <div class="app-wrp" v-if="isLoading">
        <div class="grid grid-column" v-for="i in visibleWin" :key="i">
          <template v-if="i==1">
              <div class="grid layout">
                <m-clues/>
              </div>
              <div class="grid layout">
                <m-select-topics/>
              </div>
          </template>
          <template v-if="i==2">
              <div class="grid layout">
                <m-map/>
              </div>
              <div class="grid layout">
                <m-resource-media/>
              </div>
          </template>
          <template v-if="i==3">
            <div class="grid layout">
              <m-matrix/>
              </div>
          </template>
          <template v-if="i==4">
            <div class="grid layout">
              <m-news-paper/>
            </div>
          </template>
        </div>
    </div>
    <div v-else style="color: #FFF;padding: 20px;">
      正在加载，请稍候...
    </div>
  </div>
</template>

<script>
import mMap from './modules/map'
import mClues from './modules/clues'
import mSelectTopics from './modules/select-topics'
import mResourceMedia from './modules/resource-media'
import mMatrix from './modules/matrix'
import mNewsPaper from './modules/news-paper'
import {getQueryString} from './util'
var win = [1, 2, 3, 4]
export default {
  name: 'App',
  components: {
    mMap,
    mClues,
    mSelectTopics,
    mResourceMedia,
    mMatrix,
    mNewsPaper
  },
  data () {
    return {
      visibleWin: [...win]
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.token.token
    }
  },
  created () {
    this.$store.dispatch('initToken')
    this.setVisibleWin()
  },
  methods: {
    setVisibleWin () {
      var windows = getQueryString('win')
      if (!windows) return
      windows = windows.split(',')
      var visibleWin = []
      windows.forEach(n => {
        n -= 0
        if (visibleWin.indexOf(n) < 0 && win.indexOf(n) >= 0) visibleWin.push(n)
      })
      this.visibleWin = visibleWin
    }
  }
}
</script>

<style>
#app{
  position: absolute;
  width: 3840px;
  height: 100%;
  display: flex;
  background: url(./assets/bg.jpg) no-repeat;
  background-size: auto 100%;
  font-weight: 100;
}
.app-wrp{
  position: absolute;
  left:0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 45px 30px;
  display: flex;
}
.layout {
  margin:0 30px;
}
.layout:nth-of-type(2){
  margin-top: 60px;
}
</style>
