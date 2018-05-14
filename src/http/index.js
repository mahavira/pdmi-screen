// /* ============
//  * Axios
//  * ============
//  *
//  * Promise based HTTP client for the browser and node.js.
//  * Because Vue Resource has been retired, Axios will now been used
//  * to perform AJAX-requests.
//  *
//  * https://github.com/mzabriskie/axios
//  */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {API_BASE_PATH, API_HOST} from '@/constant'
import whitelists from './whitelists'
var qs = require('qs')

axios.defaults.baseURL = API_HOST + API_BASE_PATH
axios.defaults.headers.common.Accept = 'application/json'

axios.interceptors.request.use(function (config) {
  var path = config.url.replace(config.baseURL)
  if (whitelists.indexOf(path) < 0 && whitelists.indexOf(config.url) < 0) {
    var curTime = Math.floor(new Date().getTime() / 1000)
    if (!store.state.token || !store.state.token.expires_time || curTime > store.state.token.expires_time) {
      store.dispatch('fetchToken')
      return
    }
    if (config.data) {
      config.data.token = store.state.token.token
      config.data = qs.stringify(config.data)
    } else {
      if (!config.params) config.params = {}
      config.params.token = store.state.token.token
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.data && response.data.status && response.data.status === 100) {
    // store.dispatch('auth/logout')
  }
  return response.data
}, (error) => {
  if (error && error.response) {
    if (error.response.status === 400) {
      store.dispatch('fetchToken')
    }
  }
  return Promise.reject(error)
})

// Bind Axios to Vue.
Vue.http = axios
Object.defineProperty(Vue.prototype, '$http', {
  get () {
    return axios
  }
})

/* ============
 * HTTP
 * ============
 */
// import Vue from 'vue'
// import VueResource from 'vue-resource'
// // import store from '@/store'
// import {API_BASE_PATH, API_HOST} from '@/constant'
// Vue.use(VueResource)
// Vue.http.options.emulateJSON = true
// Vue.http.options.root = API_HOST + API_BASE_PATH

// Vue.http.interceptors.push((request, next) => {
//   // console.log(request)
//   request.params.token = 'u4QkHwwoSlYU4a/sjyXK2BhAolp0UVAQ4aAZQpHh3J2Wgvs/RM2inJhWv87pIi6zMO6P1m6QW9O9SpjUXDYP5/H6IXUxUdJ2m2BEKsS5nSUa0/f17nixcfchWFjdqBQrkcKCd2Bu2BtnS6jsgyxUY0l6Y1uVJK3n2BaMG55AGOoTDSa8='
//   // return response callback
//   // return function ({body, status}) {
//   //   // console.log('response', status, body)
//   //   return body
//   // }
//   next()
// })
