export default {
  data () {
    return {
      timer: null
    }
  },
  methods: {
    startTiming () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.exceTiming()
        this.startTiming()
      }, 5000)
    },
    stopTiming () {
      clearTimeout(this.timer)
    },
    exceTiming (lg = null) {
    }
  }
}
