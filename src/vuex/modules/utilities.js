// vuex/modules/utilities.js
import Subject from '../../modules/Subjects'
import {
  SET_USER_LANGUAGE,
  SHOW_LOGIN_MODAL,
  HIDE_LOGIN_MODAL,
  SHOW_TOAST,
  HIDE_TOAST,
  SHOW_LOADING_INDICATOR,
  HIDE_LOADING_INDICATOR
} from '../mutation-types'
// initial state
const state = {
  userLanguage: 'cht',
  loginModal: false,
  loadingIndicator: false,
  toast: '',
  subjects: Subject.subjects
}

const mutations = {
  [SET_USER_LANGUAGE] (state, language) {
    state.userLanguage = language
  },
  [SHOW_LOGIN_MODAL] (state) {
    state.loginModal = true
  },
  [HIDE_LOGIN_MODAL] (state) {
    state.loginModal = false
  },
  [SHOW_TOAST] (state, text) {
    state.toast = text
  },
  [HIDE_TOAST] (state) {
    state.toast = false
  },
  [SHOW_LOADING_INDICATOR] (state, text) {
    state.loadingIndicator = true
  },
  [HIDE_LOADING_INDICATOR] (state, text) {
    state.loadingIndicator = false
  }
}

export default {
  state,
  mutations
}
