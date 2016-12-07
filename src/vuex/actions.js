import * as types from './mutation-types'

export const setUserRole = function ({ commit, state }, role) {
  commit(types.SET_USER_ROLE, role)
}

export const setUserLanguage = function ({ commit, state }, language) {
  commit(types.SET_USER_LANGUAGE, language)
}

export const showLoginModal = function ({ commit, state }) {
  commit(types.SHOW_LOGIN_MODAL)
}

export const hideLoginModal = function ({ commit, state }) {
  commit(types.HIDE_LOGIN_MODAL)
}

export const showLodingIndicator = function ({ commit, state }) {
  commit(types.SHOW_LOADING_INDICATOR)
}

export const hideLodingIndicator = function ({ commit, state }) {
  commit(types.HIDE_LOADING_INDICATOR)
}

export const showToast = function ({ commit, state }, text) {
  commit(types.SHOW_TOAST, text)
  setTimeout(() => {
    commit(types.HIDE_TOAST)
  }, 2500)
}

export const setQuickquizID = function ({ commit, state }, quiz_id) {
  commit(types.SET_QUICKQUIZ_ID, quiz_id)
}

export const setQuickquizStudents = function ({ commit, state }, students) {
  commit(types.SET_QUICKQUIZ_STUDENTS, students)
}

export const updateQuickquizStudent = function ({ commit, state }, index, student) {
  commit(types.UPDATE_QUICKQUIZ_STUDENT, index, student)
}
