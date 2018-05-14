<template>
<box title='记者地图' @mouseover.native='stopSwitchPoint' @mouseout.native='startSwitchPoint'>
  <div class='listbox' style="position:relative;display:flex">
    <div id='BMap' style="flex: 1;"></div>
    <div class="mask" :class="{open:visibleModal}"></div>
    <div class="modal-wrp" :class="{open:visibleModal}">
      <div class="modal">
        <div class="modal-body">
          <div class="modal-headpic">
            <img src="../assets/Messenger_006.png" alt="" style="width:45px;">
          </div>
          <div class="modal-content">
            <div class="text name">{{currentUser.userName || 'NONE'}}</div>
            <div class="text">{{currentUser.telphone || 'NONE'}}</div>
            <div class="text">{{currentUser.deptname || 'NONE'}}</div>
          </div>
        </div>
        <div class="modal-foot">
          <!-- <a class="btn" href="javascript:;">视频通话</a> -->
          <a class="btn" href="javascript:;" @click="()=>visibleMessageModal=!visibleMessageModal">发送消息</a>
        </div>
        <a href="javascript:;" class="modal-close" @click="closeModal"></a>
      </div>

      <div class="modal message" :class="{open:visibleMessageModal}">
        <textarea v-model="message"></textarea>
        <div class="message-foot">
          <a class="btn" href="javascript:;" @click="()=>visibleMessageModal=false">关闭</a>
          <a class="btn send" href="javascript:;" @click="sendMessage">发送</a>
        </div>
      </div>
    </div>
  </div>
</box>
</template>

<script>
/**
 * 记者地图
 */
import box from '../components/box'
import mixinRefresh from '../mixins/refresh'

var map = null
var timer = null
var myIcon = new BMap.Icon('./static/point.png', new BMap.Size(133, 57), {
  imageSize: '100% 100%'
})
export default {
  components: {box},
  mixins: [mixinRefresh],
  data () {
    return {
      points: [],
      currentPoint: 0, // 当前轮播Point
      currentUser: {}, // 当前要发送的用户id
      visibleMessageModal: false,
      visibleModal: false,
      message: ''
    }
  },
  mounted () {
    this.initBMap()
    this.fetch()
    this.timerSwitchPoint()
  },
  methods: {
    initBMap () {
      map = new BMap.Map('BMap')
      map.setMapStyle({style: 'midnight'})
      map.setMapStyle({
        styleJson: [{
          'featureType': 'background',
          'elementType': 'all',
          'stylers': {
            'color': '#000421ff'
          }
        }, {
          'featureType': 'road',
          'elementType': 'all',
          'stylers': {
            'color': '#113960ff'
          }
        }, {
          'featureType': 'all',
          'elementType': 'labels.text.fill',
          'stylers': {
            'color': '#ffffffff'
          }
        }, {
          'featureType': 'all',
          'elementType': 'labels.text.stroke',
          'stylers': {
            'color': '#ff000000'
          }
        }]
      })
      // 105.953914,26.259382 安顺市
      var position = new BMap.Point(105.953914, 26.259382)
      map.centerAndZoom(position, 11)
      var opts = {
        type: BMAP_NAVIGATION_CONTROL_ZOOM,
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      }
      map.addControl(new BMap.NavigationControl(opts))
    },
    addPoints () {
      map.clearOverlays()
      this.points.forEach(n => this.addPoint(n))
    },
    addPoint (point) {
      var position = new BMap.Point(point.lng, point.lat)
      var marker = new BMap.Marker(position, {icon: myIcon})
      map.addOverlay(marker)

      var opts = {
        position: position,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(0, -9)    // 设置文本偏移量
      }
      var label = new BMap.Label(point.userName, opts)  // 创建文本标注对象
      label.setStyle({
        color: '#FFF',
        border: 0,
        background: 'none'
      })
      map.addOverlay(label)

      marker.addEventListener('click', () => {
        this.currentUser = point
        this.switchPoint(point)
        this.visibleModal = true
      })
    },
    fetch () {
      return new Promise((resolve, reject) => {
        this.$http.get('api/findpersonpositon', {params: {}}).then(res => {
          this.points = res.map((n, i) => {
            return Object.assign(n, {
              lat: parseFloat(n.lantitude),
              lng: parseFloat(n.longitude)
            })
          })
          this.addPoints()
          resolve()
        }, err => {
          console.log(err)
          resolve()
        })
      })
    },
    sendMsg (userId, msg) {
      this.$http.post('api/sendmessage', {
        userid: userId,
        message: msg
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.code !== '200') {
          console.error('msg send error')
        }
        this.message = ''
        this.visibleMessageModal = false
        setTimeout(() => {
          this.visibleModal = false
        }, 100)
      }, () => {
        console.error('msg send error')
      })
    },
    timerSwitchPoint () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.switchPoint()
        this.timerSwitchPoint()
      }, 5000)
    },
    startSwitchPoint () {
      this.timerSwitchPoint()
    },
    stopSwitchPoint () {
      clearTimeout(timer)
    },
    switchPoint (point = null) {
      if (!this.points.length) return
      var index = 0
      if (!point) {
        index = this.currentPoint + 1
        if (index > this.points.length - 1) index = 0
        point = this.points[index]
      } else {
        this.points.forEach((n, i) => {
          if (n.userId === point.userId) index = i
        })
      }
      this.currentPoint = index
      var position = new BMap.Point(point.lng, point.lat)
      map.panTo(position)
    },
    closeModal () {
      this.visibleModal = false
      this.visibleMessageModal = false
    },
    sendMessage () {
      this.sendMsg(this.currentUser.userId, this.message)
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
.listbox {
  background: rgba(4,161,192,.1);
  border: 1px solid rgba(4,161,192,.6);
  box-shadow: 0 0 5px 2px rgba(4,161,192,.6);
  flex: 1;
  overflow: hidden;
}
.mask{
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  visibility:hidden;
  height: 100%;
}
.mask.open{
  visibility:visible;
  opacity: 1;
}
.modal-wrp{
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translate(-50%,-60%);
  transition: all 0.2s;
}
.modal-wrp.open{
  transform: translate(-50%,0);
}
.modal{
  border: 1px solid #00ffff;
  background: linear-gradient(#20dbe4 0%,#085d86 8%,#085d86 80%, #0b3a59 100%);
  transition: all 0.2s;
  border-radius: 5px;
  padding: 20px 20px 10px;
  margin-bottom: 10px;
}
.modal-body{
  display: flex;
  margin-right: 20px;
}
.modal-headpic{
  flex: 0 0 45px;
  margin-right: 20px;
}
.modal-content{
  flex: 0 0 70%;
}
.text{
  font-size: 14px;
  color: #FFF;
  text-shadow: 1px 1px 1px #000;
  line-height: 1.3;
}
.text.name {
  font-size: 16px;
  letter-spacing: 1.2em
}
.modal-foot{
  flex: 0 0 100%;
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
}
.modal-foot .btn{
  flex: 1;
  padding:2px 10px;
  background: #0b2f3a;
  color: #00ffff;
  border: 1px solid #00d8ff;
  border-radius: 2px;
  font-size: 15px;
  text-align: center;
}
.modal-close{
  position: absolute;
  right: 5px;
  top: 5px;
  width: 15px;
  height: 15px;
  background: url(../assets/close.png) no-repeat;
  background-size: cover;
}
.message{
  transform: translateY(-40px);
  visibility: hidden;
  opacity: 0;
  background: #080623;
  padding: 15px 10px;
}
.message.open{
  transform: translateY(0);
  visibility: visible;
  opacity: 1;
  border: 1px solid #159bab;
}
.message textarea{
  background: #159bab;
  border: none;
  width: 100%;
  height: 60px;
  color: #FFF;
  padding: 5px 10px;
  border-radius: 2px;
  font-size: 12px;
  box-shadow: 0 0 2px #00ffff inset;
  line-break: 1.2;
}
.message textarea:focus{
  outline: none
}
.message-foot {
  text-align: right
}
.message .btn{
  padding: 2px 15px;
  /* background: #00ffff; */
  color: #062c36;
  border: 1px solid #00ffff;
  border-radius: 2px;
  font-size: 15px;
  color: #00ffff;
}
.message .btn.send{
  color: #062c36;
  background: #00ffff;
}
</style>
