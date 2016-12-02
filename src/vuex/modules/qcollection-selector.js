// vuex/modules/qcollection-selector.js
import {
  SET_QCOLLECTION_SELECTOR_STATUS
} from '../mutation-types'

// initial state
const state = {
  show: false,
  questionId: '',
  type: ''
}

// getters
const getters = {
  qcollectionSelectorShow: state => state.show,
  qcollectionSelectorQuestionId: state => state.questionId,
  qcollectionSelectorType: state => state.type
}

// actions
const actions = {
  setQcollectionSelectorStatus ({ commit }, payload) {
    commit(SET_QCOLLECTION_SELECTOR_STATUS, payload)
  }
}

// mutations
const mutations = {
  [SET_QCOLLECTION_SELECTOR_STATUS] (state, payload) {
    state.show = payload.show
    state.questionId = payload.questionId
    state.type = payload.type
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
