<template>
  <div class="list-foot">
    <a href="javascript:;">&lt;</a>
    <a href="javascript:;" class="active">1</a>
    <a href="javascript:;">2</a>
    <a href="javascript:;">3</a>
    <a href="javascript:;">4</a>
    <a href="javascript:;">5</a>
    <a href="javascript:;">6</a>
    <a href="javascript:;">7</a>
    <a href="javascript:;">&gt;</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 0, // 当前页码
      count: 0, // 总共数目
      size: 5 // 每页数目
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
