// vuex/modules/quickquiz.js
import Vue from 'vue'
import {
  SET_QUIZ_DASHBOARD_QUIZ,
  SET_QUIZ_DASHBOARD_QUIZSAMPLES,
  SET_QUIZ_DASHBOARD_STUDENTS,
  SET_QUIZ_DASHBOARD_RC_STATUS,
  UPDATE_QUIZ_DASHBOARD_STUDENT
} from '../mutation-types'

// initial state
const state = {
  quiz: {},
  students: {},
  quizsamples: [],
  realtimeChartShow: false
}

const getters = {
  quizDashboardQuiz: state => state.quiz,
  quizDashboardStudents: state => state.students,
  quizDashboardQuizsamples: state => state.quizsamples,
  quizDashboardRCShow: state => state.realtimeChartShow
}

// actions
const actions = {
  setQuizDashboardQuiz ({ commit }, quiz) {
    commit(SET_QUIZ_DASHBOARD_QUIZ, quiz)
  },
  setQuizDashboardStudents ({ commit }, students) {
    commit(SET_QUIZ_DASHBOARD_STUDENTS, students)
  },
  setQuizDashboardQuizsamples ({ commit }, quizsamples) {
    commit(SET_QUIZ_DASHBOARD_QUIZSAMPLES, quizsamples)
  },
  setQuizDashboardRCStatus ({ commit }, status) {
    commit(SET_QUIZ_DASHBOARD_RC_STATUS, status)
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
  [SET_QUIZ_DASHBOARD_QUIZSAMPLES] (state, quizsamples) {
    state.quizsamples = quizsamples
  },
  [SET_QUIZ_DASHBOARD_RC_STATUS] (state, status) {
    state.realtimeChartShow = status
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
