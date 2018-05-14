import mListBox from '../components/list-box'

export default {
  components: {mListBox},
  data () {
    return {
      list: [],
      curPage: 0, // 当前页码
      totalPages: 0, // 总共页数
      pageSize: 5 // 每页数目
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    changeCurPage (page) {
      this.curPage = page
      this.fetch()
    }
  }
}
