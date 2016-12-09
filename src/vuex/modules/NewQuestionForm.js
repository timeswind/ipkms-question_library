// vuex/modules/qcollection-selector.js
import Vue from 'vue'
import {
  RESER_NEW_QUESTION,
  SET_NEW_QUESTION_META,
  SET_NEW_QUESTION_CONTENT,
  SET_NEW_QUESTION_IMAGES,
  SET_NEW_QUESTION_CHOICE,
  REMOVE_NEW_QUESTION_CHOICE
} from '../mutation-types'

// initial state
const state = {
  type: 'mc',
  subject: 'math',
  tags: [],
  difficulty: 1,
  content: '',
  choices: [],
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
  setNewQuestionContent ({ commit }, content) {
    commit(SET_NEW_QUESTION_CONTENT, content)
  },
  setNewQuestionImages ({ commit }, images) {
    commit(SET_NEW_QUESTION_IMAGES, images)
  },
  setNewQuestionChoice ({ commit }, payload) {
    if ('index' in payload) {
      commit(SET_NEW_QUESTION_CHOICE, payload)
    }
  },
  removeNewQuestionChoice ({ commit }, index) {
    commit(REMOVE_NEW_QUESTION_CHOICE, index)
  }
}

// mutations
const mutations = {
  [RESER_NEW_QUESTION] (state) {
    state.content = ''
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
  [SET_NEW_QUESTION_CONTENT] (state, content) {
    state.content = content || ''
  },
  [SET_NEW_QUESTION_CHOICE] (state, payload) {
    var oldChoice
    if (state.choices[payload.index]) {
      oldChoice = JSON.parse(JSON.stringify(state.choices[payload.index]))
    } else {
      oldChoice = {
        content: '',
        clue: '',
        correct: false
      }
    }
    if ('correct' in payload) {
      Vue.set(state.choices, payload.index, {
        content: payload.content || oldChoice.content || '',
        clue: payload.clue || oldChoice.clue || '',
        correct: payload.correct
      })
    } else {
      Vue.set(state.choices, payload.index, {
        content: payload.content || oldChoice.content || '',
        clue: payload.clue || oldChoice.clue || '',
        correct: oldChoice.correct
      })
    }
  },
  [REMOVE_NEW_QUESTION_CHOICE] (state, index) {
    state.choices.splice(index, 1)
    // Vue.delete(state.choices, index)
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
