<template>
<div class="chart-box">
  <div class="chart" ref="chart"></div>
  <div class="count">
    <div class="number">{{count}}</div>
    <div>{{title}}</div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    series: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      echart: null
    }
  },
  computed: {
    count () {
      var result = this.total
      if (this.total >= 10000000000) {
        result = (this.total / 10000000000).toFixed(1) + '百亿'
      } else if (this.total >= 100000000) {
        result = (this.total / 100000000).toFixed(1) + '亿'
      } else if (this.total >= 1000000) {
        result = (this.total / 1000000).toFixed(1) + '百万'
      } else if (this.total >= 10000) {
        result = (this.total / 10000).toFixed(1) + '万'
      }
      return result
    }
  },
  watch: {
    series (val) {
      this.echart.setOption({
        series: [{
          data: val
        }]
      })
    }
  },
  mounted () {
    this.echart = echarts.init(this.$refs.chart)
    var option = {
      grid: {
        left: 0,
        right: 10,
        top: 10,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: true
      },
      yAxis: {
        type: 'value',
        show: false,
        boundaryGap: false
      },
      series: [{
        data: this.series,
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        sampling: 'average',
        itemStyle: {
          normal: {
            color: '#09f6ec'
          }
        },
        lineStyle: {
          width: 1
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(23, 161, 189, 1)'
            }, {
              offset: 0.9,
              color: 'rgba(23, 161, 189, 0)'
            }])
          }
        }
      }]
    }
    this.echart.setOption(option)
  }
}
</script>

<style scoped>
.chart-box{
  flex: 1;
  display: flex;
  width: 300px;
  height: 130px;
  justify-content: center;
  align-items: center;
  text-align: left;
  box-shadow: 0 0 4px 1px RGBA(7, 122, 168, 0.75) inset,0 0 1px rgba(255,255,255,.5), 0 4px 4px rgba(0,0,0,.5);
  background: linear-gradient(rgba(19,82,112,0.57), rgba(16,53,71,0.57)); 
  overflow: hidden;
}
.chart{
  flex: 1;
  height: 100%
}
.count{
  width: 110px;
  color: #9eadbb;
  font-size: 17px;
}
.number{
  font-size: 25px;
  color: #FFF;
}
</style>
