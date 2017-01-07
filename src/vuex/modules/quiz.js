// vuex/modules/quickquiz.js
import Vue from 'vue'
import {
  SET_QUIZ,
  SET_QUIZ_SAMPLE,
  ADD_QUIZ_ANSWER,
  SET_QUIZ_ANSWERS
} from '../mutation-types'

// initial state
const state = {
  quiz: {},
  sample: {},
  answers: []
}

// getters
const getters = {
  quizInfo: state => state.quiz,
  quizSample: state => state.sample,
  quizAnswers: state => state.answers
}

// actions
const actions = {
  setQuiz ({ commit }, quiz) {
    commit(SET_QUIZ, quiz)
  },
  setQuizSample ({ commit }, sample) {
    commit(SET_QUIZ_SAMPLE, sample)
  },
  updateQuizAnswer ({ commit }, payload) {
    commit(ADD_QUIZ_ANSWER, payload)
  },
  setQuizAnswers ({ commit }, answers) {
    commit(SET_QUIZ_ANSWERS, answers)
  }
}

// mutations
const mutations = {
  [SET_QUIZ] (state, quiz) {
    state.quiz = quiz
  },
  [SET_QUIZ_SAMPLE] (state, sample) {
    state.sample = sample
  },
  [ADD_QUIZ_ANSWER] (state, payload) {
    let key = payload.key
    var keyExist = false
    var answerIndex = null
    state.answers.forEach((answerData, index) => {
      if (answerData.key === key) {
        keyExist = true
        answerIndex = index
      }
    })
    if (keyExist) {
      Vue.set(state.answers, answerIndex, {key: key, data: payload.answer})
    } else {
      state.answers.push({
        key: payload.key,
        data: payload.answer
      })
    }
  },
  [SET_QUIZ_ANSWERS] (state, answers) {
    state.answers = answers
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
