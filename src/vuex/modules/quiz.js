// vuex/modules/quickquiz.js
import Vue from 'vue'
import {
  SET_QUIZ_ID,
  SET_QUIZ_START_TIME,
  SET_QUIZ_END_TIME,
  ADD_QUIZ_ANSWER
} from '../mutation-types'

// initial state
const state = {
  quiz_id: '',
  answers: [],
  startAt: null,
  finishAt: null
}

// getters
const getters = {
  quizId: state => state.show,
  quizStartTime: state => state.startAt,
  quizEndTime: state => state.finishAt,
  quizAnswers: state => state.answers
}

// actions
const actions = {
  setQuizId ({ commit }, id) {
    commit(SET_QUIZ_ID, id)
  },
  setQuizStartTime ({ commit }, time) {
    commit(SET_QUIZ_START_TIME, time)
  },
  setQuizEndTime ({ commit }, time) {
    commit(SET_QUIZ_END_TIME, time)
  },
  updateQuizAnswer ({ commit }, payload) {
    commit(ADD_QUIZ_ANSWER, payload)
  }
}

// mutations
const mutations = {
  [SET_QUIZ_ID] (state, id) {
    state.quiz_id = id
  },
  [SET_QUIZ_START_TIME] (state, time) {
    state.startAt = time
  },
  [SET_QUIZ_END_TIME] (state, time) {
    state.finishAt = time
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
