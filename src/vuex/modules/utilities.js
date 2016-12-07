// vuex/modules/utilities.js
import Subject from '../../modules/Subjects'
import Language from '../../modules/Languages'
import {
  SET_USER_ROLE,
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
  userRole: '',
  userLanguage: 'cht',
  loginModal: false,
  loadingIndicator: false,
  toast: '',
  subjects: Subject.subjects,
  languages: Language.languages,
  alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
}

const getters = {
  getUserRole: state => state.userRole,
  getSubjects: state => state.subjects,
  getLanguages: state => state.languages,
  getAlphabet: state => state.alphabet
}

const mutations = {
  [SET_USER_ROLE] (state, role) {
    state.userRole = role
  },
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
  getters,
  mutations
}
