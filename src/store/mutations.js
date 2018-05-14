export default {
  setToken (state, token) {
    state.token = token
    localStorage.setItem('token', JSON.stringify(token))
  },
  replaceModules (state, modules) {
    state.modules = modules
  }
}
