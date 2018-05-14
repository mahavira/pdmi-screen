<template>
<box :title="title">
  <div class="list-box">
   <div class="list-content">
      <slot></slot>
   </div>
    <div class="list-foot">
      <a href="javascript:;" @click="handlePrev" :class="{disabled: disPrev}">&lt;</a>
      <a href="javascript:;" @click="handlePage(item)" v-for="(item, index) in pages" :key="index" :class="{active: item==curPage+1, ellipsis: item==ellipsis}">{{item}}</a>
      <a href="javascript:;" @click="handleNext" :class="{disabled: disNext}">&gt;</a>
    </div>
  </div>
</box>

</template>

<script>
import box from './box'
export default {
  components: {box},
  props: {
    title: String,
    curPage: {
      type: Number,
      default: 0
    }, // 当前页码
    totalPages: {
      type: Number,
      default: 0
    }, // 总共页数
    visiblePages: {
      type: Number,
      default: 6
    }, // 可见页
    ellipsis: {
      type: String,
      default: '...'
    } // 省略号
  },
  data () {
    return {
    }
  },
  computed: {
    pages () {
      let result = []
      let i = 0
      let {visiblePages, totalPages, curPage, ellipsis} = this
      curPage += 1
      if (totalPages <= visiblePages) { // 总页数<=可见页
        for (i = 1; i <= totalPages; i++) {
          result.push(i)
        }
      } else { // 总页数>可见页
        if (curPage < visiblePages - 1) { // 当前页<可见页-1
          for (i = 1; i <= visiblePages - 1; i++) {
            result.push(i)
          }
          result.push(ellipsis)
          result.push(totalPages)
        } else if (curPage >= visiblePages - 1) {  // 当前页>=可见页-1
          result.push(1)
          result.push(ellipsis)
          if (totalPages - curPage <= visiblePages - 4) { // 能连到结束
            for (i = totalPages - (visiblePages - 2); i <= totalPages; i++) {
              result.push(i)
            }
          } else { // 不能连到结束
            for (i = curPage - (visiblePages - 4); i <= curPage + 2; i++) {
              result.push(i)
            }
            result.push(ellipsis)
            result.push(totalPages)
          }
        }
      }
      return result
    },
    disPrev () {
      return this.curPage < 1
    },
    disNext () {
      return this.totalPages <= this.curPage + 1
    }
  },
  methods: {
    handlePrev () {
      if (this.disPrev) return
      this.$emit('update:curPage', this.curPage - 1)
    },
    handleNext () {
      if (this.disNext) return
      this.$emit('update:curPage', this.curPage + 1)
    },
    handlePage (page) {
      if (page === this.ellipsis) return
      this.$emit('update:curPage', page - 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-box {
  flex: 1;
  margin: -5px -5px;
  padding-top: 7px;
  background: url(../assets/list-top.png) center top no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: column;
}
.list-content{
  height: 325px;
  padding:0 6px;
  background: url(../assets/list-rep.png) center repeat-y;  background-size: 100%;
}

.list-foot{
  background: url(../assets/list-foot.png) center no-repeat;
  background-size: 100% 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-foot a{
  display: inline-block;
  text-align: center;
  width: 25px;
  height: 25px;
  font-size: 12px;
  line-height: 25px;
  color: #FFF;
  border-radius: 3px;
  margin: 0 5px;
  background: linear-gradient(rgba(0,240,255,0.5), rgba(255,255,255,0));
  box-shadow: 0 1px 3px 0 rgba(0,0,0,1),0 1px 2px rgba(255,255,255,0.55) inset;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.75);
}
.list-foot a.active{
  background: linear-gradient(#d2730f, #ad7d16);
  color: #000;
}
.list-foot a.disabled{
  cursor: not-allowed;
  box-shadow: none;
  opacity: .65;
}
.list-foot a.ellipsis{
  background: none;
  box-shadow: none
}
</style>
