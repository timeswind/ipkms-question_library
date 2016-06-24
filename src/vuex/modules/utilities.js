// vuex/modules/utilities.js
import {
  SHOW_LOGIN_MODAL,
  HIDE_LOGIN_MODAL,
  SHOW_TOAST
} from '../mutation-types'
// initial state
const state = {
  loginModal: false,
  toast: ''
}

const mutations = {
  [SHOW_LOGIN_MODAL] (state) {
    state.loginModal = true
  },
  [HIDE_LOGIN_MODAL] (state) {
    state.loginModal = false
  },
  [SHOW_TOAST] (state, text) {
    state.toast = text
  }
}

export default {
  state,
  mutations
}
