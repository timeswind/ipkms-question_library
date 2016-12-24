// vuex/modules/quickquiz.js
import Vue from 'vue'
import {
  SET_QUIZ_DASHBOARD_QUIZ,
  SET_QUIZ_DASHBOARD_STUDENTS,
  UPDATE_QUIZ_DASHBOARD_STUDENT
} from '../mutation-types'

// initial state
const state = {
  quiz: {},
  students: {}
}

const getters = {
  quizDashboardQuiz: state => state.quiz,
  quizDashboardStudents: state => state.students
}

// actions
const actions = {
  setQuizDashboardQuiz ({ commit }, quiz) {
    commit(SET_QUIZ_DASHBOARD_QUIZ, quiz)
  },
  setQuizDashboardStudents ({ commit }, students) {
    commit(SET_QUIZ_DASHBOARD_STUDENTS, students)
  },
  updateQuizDashboardStudent ({ commit }, payload) {
    commit(UPDATE_QUIZ_DASHBOARD_STUDENT, payload)
  }
}

// mutations
const mutations = {
  [SET_QUIZ_DASHBOARD_QUIZ] (state, quiz) {
    state.quiz = quiz
  },
  [SET_QUIZ_DASHBOARD_STUDENTS] (state, students) {
    state.students = students
  },
  [UPDATE_QUIZ_DASHBOARD_STUDENT] (state, payload) {
    if (payload.id) {
      Vue.set(state.students, payload.id, payload.student)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
