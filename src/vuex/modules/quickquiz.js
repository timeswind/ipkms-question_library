// vuex/modules/quickquiz.js
import Vue from 'vue'
import {
  SET_QUICKQUIZ_ID,
  SET_QUICKQUIZ_DETAIL,
  SET_QUICKQUIZ_STUDENTS,
  UPDATE_QUICKQUIZ_STUDENT
} from '../mutation-types'

// initial state
const state = {
  id: '',
  detail: {},
  students: []
}

// mutations
const mutations = {
  [SET_QUICKQUIZ_ID] (state, id) {
    state.id = id
  },
  [SET_QUICKQUIZ_DETAIL] (state, detail) {
    state.detail = detail
  },
  [SET_QUICKQUIZ_STUDENTS] (state, students) {
    state.students = students
  },
  [UPDATE_QUICKQUIZ_STUDENT] (state, index, student) {
    Vue.set(state.students, index, student)
  }
}

export default {
  state,
  mutations
}
