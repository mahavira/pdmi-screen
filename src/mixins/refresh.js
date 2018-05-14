export default {
  data () {
    return {
      timer: null,
      componentTag: ''
    }
  },
  computed: {
    refreshTime () {
      if (!this.componentTag) {
        var tag = this.$options._componentTag
        tag = tag.replace('m-', '')
        this.componentTag = tag
      }
      var modules = this.$store.state.modules
      if (modules[this.componentTag] && modules[this.componentTag].refreshTime) return modules[this.componentTag].refreshTime
      return 1000 * 20
    }
  },
  watch: {
    refreshTime (val) {
      if (val) {
        this.timerRefresh()
      }
    }
  },
  mounted () {
    this.timerRefresh()
  },
  methods: {
    timerRefresh () {
      clearTimeout(this.timer)
      if (!this.autoRefresh && typeof this.autoRefresh !== 'function') return
      this.timer = setTimeout(() => {
        this.autoRefresh().then(this.timerRefresh)
      }, this.refreshTime)
    },
    stopTimerRefresh () {
      clearTimeout(this.timer)
    }
  }
}
