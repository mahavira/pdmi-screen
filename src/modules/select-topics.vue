<template>
<m-list-box title="在线选题" :totalPages="totalPages" :curPage.sync="curPage" @update:curPage="changeCurPage">
    <table class="table">
      <thead>
        <tr>
          <th>选题名称</th>
          <th class="text-center">状态</th>
          <th class="text-center">负责人</th>
          <th class="text-center">所属部门</th>
          <th class="text-center">开始时间</th>
        </tr>
      </thead>
        <draggable element="tbody" v-if="list.length">
          <tr v-for="item in list" :key="item.id">
            <td style="width: 350px;max-width: 350px;"><a :href="item.targetUrl" target="_blank">{{item.title}}</a></td>
            <td class="text-center" style="width: 100px;max-width: 100px;"><i class="icon" :class="item.status"></i></td>
            <td class="text-center" style="width: 100px;max-width: 100px;">{{item.charger}}</td>
            <td class="text-center" style="width: 120px;max-width: 120px;">{{item.department}}</td>
            <td class="text-center" style="width: 120px;max-width: 120px;">{{item.exeStartTime}}</td>
          </tr>
        </draggable>
      <tbody v-else>
        <tr>
          <td class="text-center no-data" colspan="5">没有数据</td>
        </tr>
      </tbody>
    </table>
</m-list-box>

</template>

<script>
// 100-保存，101-提交，102-进行中，103-完成，104-终止，105-删除
import mixinLists from '../mixins/lists'
import draggable from 'vuedraggable'
import mixinRefresh from '../mixins/refresh'

var cls = {
  100: 'save',
  101: 'submit',
  102: 'progress',
  103: 'complete',
  104: 'end',
  105: 'delete'
}
export default {
  mixins: [mixinLists, mixinRefresh],
  components: {draggable},
  methods: {
    fetch () {
      return new Promise((resolve, reject) => {
        this.$http.get('api/findselecttopic', {
          params: {
            page: this.curPage,
            size: this.pageSize
          }
        }).then(res => {
          this.list = res.content.map(n => {
            return Object.assign(n, {
              id: n.id,
              title: n.title,
              status: cls ? cls[n.topicStatus] : null,
              charger: n.charger,
              department: n.department,
              exeStartTime: n.exeStartTime ? n.exeStartTime.slice(0, 10) : null,
              targetUrl: './static/login.html?target_url=' + encodeURIComponent(n.detailUrl)
            })
          })
          this.totalPages = res.totalPages
          return resolve()
        }, () => {
          return resolve()
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
