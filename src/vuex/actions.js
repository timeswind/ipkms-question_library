// action 会收到 store 作为它的第一个参数
// 在 store 里我们只需要 dispatch （在有些情况下需要 state）
// 我们可以利用 ES6 的解构（destructuring）语法来简化参数的使用
export const showLoginModal = function ({ dispatch, state }) {
  dispatch('showLoginModal')
}

export const hideLoginModal = function ({ dispatch, state }) {
  dispatch('hideLoginModal')
}

export const showToast = function ({ dispatch, state }, text) {
  dispatch('showToast', text)
}
