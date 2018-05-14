<template>
<box title="电子报">
  <div class="content">
    <div class="newspaper-box" v-for="(item,index) in images" :key="item.id" :class="{deactivation: currentImage!=index}" @click="handleSwitch(index)"><img class="newspaper-img" :src="item.picUrl" :alt="item.name"></div>
  </div>
</box>
</template>

<script>
/**
 * 电子报
 */
import box from '../components/box'
import chartLine from '../components/chart-line'
import mixinRefresh from '../mixins/refresh'

var timer = null
export default {
  components: {box, chartLine},
  mixins: [mixinRefresh],
  data () {
    return {
      images: [],
      currentImage: 0,
      switchTime: 60000
    }
  },
  mounted () {
    this.startTimer()
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        this.$http.get('api/findepaper', {
          params: {
            page: 0,
            size: 2
          }
        }).then(res => {
          this.images = res.content
          resolve()
        }, err => {
          console.log(err)
          resolve()
        })
      })
    },
    startTimer () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.switch()
        this.startTimer()
      }, this.switchTime)
    },
    stopTimer () {
      clearTimeout(timer)
    },
    switch (index = null) {
      if (index === null) {
        index = this.currentImage + 1
        if (index > this.images.length - 1) index = 0
      }
      this.currentImage = index
    },
    handleSwitch (index) {
      this.switch(index)
      this.startTimer()
    },
    /**
     * 定时自动刷新
     */
    autoRefresh () {
      return this.fetch()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  flex:1;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}
.newspaper-box{
  transition: all 0.8s ease-out;
  opacity: 1;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: left top;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: in;
  animation-timing-function: ease;
}

.newspaper-img{
  height: 910px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
.newspaper-box.deactivation{
  background: rgba(0,0,0,0);
  animation-name: out;
  z-index: 2;
}
@keyframes in {
  0% {
    transform: translateX(590px) scale(0.4);
    opacity: 0.5;
  }
  40% {
    transform: translateX(0) scale(0.4);
  }
  70% {
    transform: translateX(0) scale(0.4);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
@keyframes out {
  0% {
    transform: translateX(0px);
    opacity: 1;
  }
  70% {
    opacity: 1;
    transform: translateX(290px);
  }
  100% {
    transform: translateX(625px) scale(0.4);
    opacity: 0.5;
  }
}
</style>

