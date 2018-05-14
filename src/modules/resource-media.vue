<template>
<m-list-box title="媒资库" :totalPages="totalPages" :curPage.sync="curPage" @update:curPage="changeCurPage">
    <table class="table">
      <thead>
        <tr>
          <th>序号</th>
          <th>作品名称</th>
          <th class="text-center">状态</th>
          <th class="text-center">作者</th>
          <th class="text-center">提交时间</th>
        </tr>
      </thead>
      <tbody v-if="list.length">
        <tr v-for="(item,index) in list" :key="item.id">
          <td style="width: 100px;max-width: 100px;">{{index+1}}</td>
          <td style="width: 480px;max-width: 480px;">{{item.name}}</td>
          <td class="text-center" style="width: 100px;max-width: 100px;">{{item.productState}}</td>
          <td class="text-center" style="width: 100px;max-width: 100px;">{{item.author}}</td>
          <td class="text-center" style="width: 120px;max-width: 120px;">{{item.created}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="text-center no-data" colspan="5">没有数据</td>
        </tr>
      </tbody>
    </table>
</m-list-box>

</template>

<script>
import mixinLists from '../mixins/lists'
import mixinRefresh from '../mixins/refresh'

export default {
  mixins: [mixinLists, mixinRefresh],
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        this.$http.get('api/findrescource', {
          params: {
            page: this.curPage,
            size: this.pageSize
          }
        }).then(res => {
          this.list = res.content.map((n, i) => {
            return {
              resourceid: n.resourceid,
              name: n.name,
              productState: n.productState,
              author: n.author,
              created: n.created ? n.created.slice(0, 10) : null
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
    /**
     * 定时自动刷新
     */
    autoRefresh () {
      return this.fetch()
    }
  }
}
</script>

<style scoped>
</style>
