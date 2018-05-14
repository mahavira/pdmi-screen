<template>
<m-list-box title="第一线索" :totalPages="totalPages" :curPage.sync="curPage" @update:curPage="changeCurPage">
  <table class="table">
    <thead>
      <tr>
        <th>线索名称</th>
        <th class="filter">
            <a v-for="(item,index) in filters" :key="index" href="javascript:;" class="filter-item" :class="{active:index==filter}" @click="handleFilter(index)">{{item.cn}}</a>
        </th>
      </tr>
    </thead>
    <tbody v-if="list.length">
      <tr v-for="item in list" :key="item.id">
        <td style="width: 690px;max-width: 690px;">{{item.title}}</td>
        <td class="text-center">{{item.syncTime}}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td class="text-center no-data" colspan="2">没有数据</td>
      </tr>
    </tbody>
  </table>
</m-list-box>
</template>

<script>
import mixinLists from '../mixins/lists'
import mixinRefresh from '../mixins/refresh'
var filters = {
  day: {
    cn: '今日',
    url: 'todayclue'
  },
  week: {
    cn: '本周',
    url: 'thisweekclue'
  },
  month: {
    cn: '本月',
    url: 'thismonthclue'
  }
}
export default {
  mixins: [mixinLists, mixinRefresh],
  data () {
    return {
      filters,
      filter: 'day'
    }
  },
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        this.$http.get('api/' + filters[this.filter].url, {
          params: {
            page: this.curPage,
            size: this.pageSize
          }
        }).then(res => {
          this.list = res.content.map((n, i) => {
            return {
              id: n.id,
              title: n.title,
              syncTime: n.syncTime ? n.syncTime.slice(0, 10) : null
            }
          })
          this.totalPages = res.totalPages
          resolve()
        }, err => {
          console.log(err)
          resolve()
        })
      })
    },
    switch (index = null) {
      if (index === null) {
        var ks = Object.keys(this.filters)
        var i = ks.indexOf(this.filter)
        i = i + 1
        if (i > ks.length - 1) i = 0
        index = ks[i]
      }
      this.filter = index
      this.curPage = 0
      return this.fetch()
    },
    handleFilter (index) {
      this.switch(index)
    },
    /**
     * 定时自动刷新
     */
    autoRefresh () {
      return this.switch()
    }
  }
}
</script>

<style scoped>
.filter{
  padding-top: 20px;
  width: 220px;
}
.filter-item{
  margin: 0 5px;
  padding: 5px 3px;
}

</style>
