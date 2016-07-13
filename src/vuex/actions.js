import * as types from './mutation-types'

export const showLoginModal = function ({ dispatch, state }) {
  dispatch(types.SHOW_LOGIN_MODAL)
}

export const hideLoginModal = function ({ dispatch, state }) {
  dispatch(types.HIDE_LOGIN_MODAL)
}

export const showLodingIndicator = function ({ dispatch, state }) {
  dispatch(types.SHOW_LOADING_INDICATOR)
}

export const hideLodingIndicator = function ({ dispatch, state }) {
  dispatch(types.HIDE_LOADING_INDICATOR)
}

export const showToast = function ({ dispatch, state }, text) {
  dispatch(types.SHOW_TOAST, text)
}

export const setQuickquizID = function ({ dispatch, state }, quiz_id) {
  dispatch(types.SET_QUICKQUIZ_ID, quiz_id)
}

export const setQuickquizStudents = function ({ dispatch, state }, students) {
  dispatch(types.SET_QUICKQUIZ_STUDENTS, students)
}

export const updateQuickquizStudent = function ({ dispatch, state }, index, student) {
  dispatch(types.UPDATE_QUICKQUIZ_STUDENT, index, student)
}
