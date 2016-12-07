// vuex/modules/qcollection-selector.js
import {
  SET_QUIZPAPER_QUESTIONS,
  SET_QUIZPAPER_MODE
} from '../mutation-types'

// initial state
const state = {
  questions: [],
  mode: 'paper'
}

// getters
const getters = {
  quizPaperQuestions: state => state.questions,
  quizPaperMode: state => state.mode
}

// actions
const actions = {
  setQuizPaperQuestions ({ commit }, questions) {
    commit(SET_QUIZPAPER_QUESTIONS, questions)
  },
  setQuizPaperMode ({commit}, mode) {
    commit(SET_QUIZPAPER_MODE, mode)
  }
}

// mutations
const mutations = {
  [SET_QUIZPAPER_QUESTIONS] (state, questions) {
    state.questions = questions
  },
  [SET_QUIZPAPER_MODE] (state, mode) {
    state.mode = mode
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
