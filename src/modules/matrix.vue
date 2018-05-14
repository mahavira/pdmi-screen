<template>
<box title="新媒体矩阵">
    <div class="filter">
      <a v-for="(item,index) in filters" :key="index" href="javascript:;" class="filter-item" :class="{'active': item.value==filter}" @click="handleFilter(item.value)">{{item.alias}}</a>
    </div>
    <div class="content">
      <matrix-item v-for="(item,index) in items" :key="index" :type="index" :title="item.title" :charts="item.charts" :news="item.news"></matrix-item>
    </div>
</box>

</template>

<script>
/**
 * 新媒体矩阵
 */
import box from '../components/box'
import matrixItem from '../components/matrix-item'
import mixinRefresh from '../mixins/refresh'
var items = {
  pc: {
    title: '网站',
    value: 1,
    news: [],
    charts: [{
      data: [],
      total: 0,
      title: '访问量PV'
    }, {
      data: [],
      total: 0,
      title: '访问量UV'
    }]
  },
  wechat: {
    title: '微信',
    value: 4,
    news: [],
    charts: [{
      data: [],
      total: 0,
      title: '文章阅读数'
    }, {
      data: [],
      total: 0,
      title: '点赞数'
    }]
  },
  app: {
    title: '客户端',
    value: 2,
    news: [],
    charts: [{
      data: [],
      total: 0,
      totalName: '日活用户'
    }, {
      data: [],
      total: 0,
      title: '新增用户'
    }]
  },
  weibo: {
    title: '微博',
    value: 3,
    news: [],
    charts: [{
      data: [],
      total: 0,
      title: '粉丝数'
    }, {
      data: [],
      total: 0,
      title: '互动数'
    }]
  }
}

var filters = {
  day: {
    value: 1,
    alias: '日'
  },
  week: {
    value: 2,
    alias: '周'
  }
}

export default {
  mixins: [mixinRefresh],
  components: {box, matrixItem},
  data () {
    return {
      filters,
      filter: 1,
      items
    }
  },
  mounted () {
    this.fetchAll()
  },
  methods: {
    fetch (type) {
      return new Promise((resolve, reject) => {
        this.$http.get('api/findmediamatrix', {params: {
          periodType: this.filter,
          clientType: this.items[type].value
        }}).then(res => {
          if (res && res.length && res[0].data) {
            try {
              var data = JSON.parse(res[0].data)
              this.items[type].news = data.hot_word
              this.items[type].charts[0] = data.widget1
              this.items[type].charts[1] = data.widget2
            } catch (e) {
              console.error('数据错误!', 'type:' + type, 'periodType:' + this.filter)
            }
          } else {
            this.resetChartsData(this.items[type])
          }
          resolve()
        }, () => {
          this.resetChartsData(this.items[type])
          resolve()
        })
      })
    },
    resetChartsData (item) {
      item.news = []
      item.charts[0]['data'] = [0, 0, 0, 0, 0, 0, 0]
      item.charts[0]['total'] = 0
      item.charts[1]['data'] = [0, 0, 0, 0, 0, 0, 0]
      item.charts[1]['total'] = 0
    },
    fetchAll () {
      var promises = []
      for (var k in this.items) {
        promises.push(this.fetch(k))
      }
      return Promise.all(promises)
    },
    switch (value = null) {
      this.filter = value
      return this.fetchAll()
    },
    handleFilter (value) {
      return this.switch(value)
    },
    /**
     * 定时自动刷新
     */
    autoRefresh () {
      var ks = []
      for (var k in this.filters) ks.push(this.filters[k].value)
      var i = ks.indexOf(this.filter)
      i = i + 1
      if (i > ks.length - 1) i = 0
      return this.switch(ks[i])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.content {
  flex:1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.filter{
  height: 90px;
  padding-top: 20px;
  text-align: center;
}
.filter-item {
  padding: 5px 15px;
}

</style>

