// vuex/modules/qcollection-selector.js
import {
  SET_QUIZPAPER_ID,
  SET_QUIZPAPER_QUESTIONS,
  SET_QUIZPAPER_MODE,
  SET_QUIZPAPER_QUIZSAMPLE
} from '../mutation-types'

// initial state
const state = {
  id: '',
  mode: 'paper',
  questions: [],
  quizsample: {}
}

// getters
const getters = {
  quizPaperId: state => state.id,
  quizPaperQuestions: state => state.questions,
  quizPaperMode: state => state.mode,
  quizPaperQuizsample: state => state.quizsample
}

// actions
const actions = {
  setQuizPaperId ({ commit }, id) {
    commit(SET_QUIZPAPER_ID, id)
  },
  setQuizPaperQuestions ({ commit }, questions) {
    commit(SET_QUIZPAPER_QUESTIONS, questions)
  },
  setQuizPaperMode ({commit}, mode) {
    commit(SET_QUIZPAPER_MODE, mode)
  },
  setQuizPaperQuizsample ({commit}, quizsample) {
    commit(SET_QUIZPAPER_QUIZSAMPLE, quizsample)
  }
}

// mutations
const mutations = {
  [SET_QUIZPAPER_ID] (state, id) {
    state.id = id
  },
  [SET_QUIZPAPER_QUESTIONS] (state, questions) {
    state.questions = questions
  },
  [SET_QUIZPAPER_MODE] (state, mode) {
    state.mode = mode
  },
  [SET_QUIZPAPER_QUIZSAMPLE] (state, quizsample) {
    state.quizsample = quizsample
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
