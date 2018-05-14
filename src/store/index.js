/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import state from './state'
import actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  /**
   * If strict mode should be enabled.
   */
  strict: debug,
  mutations,
  actions,
  state: state,
  /**
   * Plugins used in the store.
   */
  plugins: debug ? [createLogger()] : []
})
