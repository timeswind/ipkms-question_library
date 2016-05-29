import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个 object 存储应用启动时的状态
const state = {
  loginModal: false,
  toast: ''
}

// 创建一个 object 存储 mutation 函数
const mutations = {
  showLoginModal (state) {
    state.loginModal = true
  },
  hideLoginModal (state) {
    state.loginModal = false
  },
  showToast (state, text) {
    state.toast = text
  }
}

// 通过 new Vuex.Store 结合初始 state 和 mutations，创建 store
// 这个 store 将和我们的 vue 应用链接起来
export default new Vuex.Store({
  state,
  mutations
})
