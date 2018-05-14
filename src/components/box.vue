<template>
<div class="box">
  <div class="th">{{title}}
    <div class="th-decorate">
        <span class="short"></span>
        <span class="short"></span>
        <span class="long"></span>
    </div>
  </div>
  <slot/>
</div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box{
  flex:1;
  display: flex;
  flex-direction: column;
}

.th{
  line-height: 1;
  font-size: 25px;
  font-weight: 700;
  color: #FFF;
  padding: 5px 0 5px 25px;
  margin-bottom: 30px;
  position: relative;
}
.th:before{
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: calc(100% - 100px);
  height: 2px;
  background: rgba(4,161,192,1);
}
.th-decorate{
  position: absolute;
  right: 0;
  bottom: 6px;
  width: 136px;
  height: 23px;
  transform: skewX(-40deg);
  transform-origin: left top;
  display: flex;
}

.th-decorate .short{
  width: 15px;
  background: rgba(4,161,192,1);
  margin-right: 8px;
}
.th-decorate .long{
  width: 90px;
  background: rgba(4,161,192,1);
}

.th-decorate::before{
  content: '';
  position: absolute;
  bottom: -8px;
  right: 0;
  width: 100%;
  margin-top: 8px;
  height: 2px;
  background: rgba(4,161,192,1);
}
</style>
