// vuex/modules/qcollection-selector.js
import {
  RESER_NEW_QUESTION,
  SET_NEW_QUESTION_META,
  SET_NEW_QUESTION_DELTA,
  SET_NEW_QUESTION_IMAGES,
  SET_NEW_QUESTION_CHOICE,
  SET_NEW_QUESTION_ANSWERS
} from '../mutation-types'

// initial state
const state = {
  type: 'mc',
  subject: 'math',
  tags: [],
  difficulty: 1,
  delta: '',
  choices: [],
  answers: [],
  images: []
}

// getters
const getters = {
  newQuestionState: state => state
}

// actions
const actions = {
  resetNewQuestion ({ commit }) {
    commit(RESER_NEW_QUESTION)
  },
  setNewQuestionMeta ({ commit }, payload) {
    commit(SET_NEW_QUESTION_META, payload)
  },
  setNewQuestionDelta ({ commit }, delta) {
    commit(SET_NEW_QUESTION_DELTA, delta)
  },
  setNewQuestionImages ({ commit }, images) {
    commit(SET_NEW_QUESTION_IMAGES, images)
  },
  setNewQuestionChoice ({ commit }, payload) {
    commit(SET_NEW_QUESTION_CHOICE, payload)
  },
  setNewQuestionAnswers ({ commit }, answers) {
    commit(SET_NEW_QUESTION_ANSWERS, answers)
  }
}

// mutations
const mutations = {
  [RESER_NEW_QUESTION] (state) {
    state.delta = ''
    state.choices = []
    state.answers = []
    state.images = []
  },
  [SET_NEW_QUESTION_META] (state, payload) {
    state.type = payload.type || state.type
    state.subject = payload.subject || state.subject
    state.tags = payload.tags || state.tags
    state.difficulty = payload.difficulty || state.difficulty
  },
  [SET_NEW_QUESTION_DELTA] (state, delta) {
    state.delta = delta || ''
  },
  [SET_NEW_QUESTION_CHOICE] (state, payload) {
    if ('index' in payload) {
      state.choices[payload.index] = payload.delta || ''
    }
  },
  [SET_NEW_QUESTION_ANSWERS] (state, answers) {
    state.answers = answers || []
  },
  [SET_NEW_QUESTION_IMAGES] (state, images) {
    state.images = images || []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
