<template>
  <div class="item" :class="type">
    <div class="hd">
      <h2 class="hd-title">{{title}}</h2>
      <marquee class="hd-extra" scrolldelay=0>
        <span v-for="item in news" :key="item.url">
          <span class="hot">{{item.name}}</span>
          <span class="eye">{{item.read?item.read:0}}</span>
        </span>
      </marquee>
    </div>
    <div class="grid">
      <div class="grid" v-for="(item,index) in charts" :key="index">
        <chart-line :total="item.total" :series="item.data" :title="item.title"/>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * 新媒体矩阵 - item
 */
import chartLine from './chart-line'
export default {
  components: {chartLine},
  props: {
    type: {
      type: String,
      default: 'pc'
    },
    title: {
      type: String,
      default: '网站'
    },
    charts: {
      type: Array,
      default: [{}, {}]
    },
    news: {
      type: Array,
      default: []
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item{
  height: 171px;
}
.hd {
  display: flex;
  line-height: 26px;
  margin-bottom: 15px;
}
.hd-title{
  width: 110px;
  margin: 0;
  font-size: 22px;
  color: #ffd800;
  background: url(../assets/icon-wechat.png) center left no-repeat;
  background-size: 27px 22px;
  padding-left: 35px;
  font-weight: 400;
}
.pc .hd-title{
  background-image: url(../assets/icon-pc.png);
  background-size: 23px 21px;
}
.app .hd-title{
  background-image: url(../assets/icon-app.png);
  background-size: 15px 24px;
  padding-left: 28px;
}
.weibo .hd-title{
  background-image: url(../assets/icon-weibo.png);
  background-size: 27px 22px;
}
.hd-extra{
  /* flex: 1; */
  color: #FFF;
  /* text-align: right; */
  font-size: 17px;
  font-weight: 100;
  padding-right: 5px;
  width: 760px;
  white-space: nowrap;  
  text-overflow:ellipsis; 
  overflow:hidden;
  }
.hd-extra .hot,.hd-extra .eye{
  margin-left: 30px;
}
.hd-extra .hot{
  background: url(../assets/icon-heart.png) center left no-repeat;
  background-size: 15px 15px;
  padding-left: 20px;
}
.hd-extra .eye{
  background: url(../assets/icon-eye.png) center left no-repeat;
  background-size: 22px 14px;
  padding-left: 25px;
}

.item .grid .grid:first-of-type{
  margin-right: 25px;
}
</style>

