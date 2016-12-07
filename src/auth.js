/* globals sessionStorage */
export default {
  getToken () {
    return sessionStorage.token
  },

  getRole () {
    return sessionStorage.role
  },

  logout (cb) {
    delete sessionStorage.token
    if (cb) cb()
  },

  loggedIn () {
    return !!sessionStorage.token
  }
}
