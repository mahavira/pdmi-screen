import Vue from 'vue'
var isFetchToken = false
export default {
  initToken ({ state, commit, dispatch }) {
    let tokenStr = localStorage.getItem('token') || null
    let token = JSON.parse(tokenStr)
    var curTime = Math.floor(new Date().getTime() / 1000)
    if (token && token.expires_time && curTime < token.expires_time) {
      commit('setToken', token)
      dispatch('fetchSynconfig')
      return
    }
    dispatch('fetchToken')
  },
  fetchToken ({ commit, dispatch }) {
    if (isFetchToken) return
    isFetchToken = true
    Vue.http.get('api/autorefreshpuptoken').then((res) => {
      isFetchToken = false
      if (res.access_token) {
        commit('setToken', {
          token: res.access_token,
          expires_time: res.expires_in - 10 + Math.floor(new Date().getTime() / 1000)
        })
        // dispatch('fetchSynconfig')
      } else {
        dispatch('refreshToken')
      }
    }, e => {
      isFetchToken = false
      dispatch('refreshToken')
    })
  },
  refreshToken ({ commit, dispatch }) {
    if (isFetchToken) return
    isFetchToken = true
    Vue.http.get('api/refreshpuptoken').then((res) => {
      isFetchToken = false
      if (res.access_token) {
        commit('setToken', {
          token: res.access_token,
          expires_time: res.expires_in - 10 + Math.floor(new Date().getTime() / 1000)
        })
        // dispatch('fetchSynconfig')
      } else {
        console.warn('token获取失败')
      }
    }, () => {
      isFetchToken = false
      console.warn('token获取失败')
    })
  },
  fetchSynconfig ({ commit, state, dispatch }) {
    Vue.http.get('api/findallsynconfig', {}).then((res) => {
      var modules = Object.assign({}, state.modules)
      if (Object.prototype.toString.call(res) === '[object Array]') {
        res.forEach((n, i) => {
          for (var k in modules) {
            if (modules[k].moudleName === n.moudleName) {
              modules[k] = Object.assign(n, {
                refreshTime: parseInt(n.refreshTime) * 60 * 1000
              })
              break
            }
          }
        })
        commit('replaceModules', modules)
        setTimeout(() => dispatch('fetchSynconfig'), 5000)
      } else {
        console.error('fetchSynconfig error')
      }
    }, e => {
      console.error('fetchSynconfig error')
    })
  }
}
