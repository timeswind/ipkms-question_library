// vuex/modules/qcollection-selector.js
import {
  SET_ADMINPANEL_USERS,
  SET_ADMINPANEL_USER,
  SET_ADMINPANEL_SEARCH_OPTIONS,
  SET_ADMINPANEL_NEWUSER_META,
  RESET_ADMINPANEL_NEWUSER_META
} from '../mutation-types'

// initial state
const state = {
  users: [],
  user: {},
  searchKey: '',
  searchRole: 'teacher',
  newUser: {
    name: '',
    role: 'teacher',
    email: '',
    schoolId: '',
    password: ''
  }
}

// getters
const getters = {
  adminPanelUsers: state => state.users,
  adminPanelUserDetail: state => state.user,
  adminPanelSearchKey: state => state.searchKey,
  adminPanelSearchRole: state => state.searchRole,
  adminPanelNewUser: state => state.newUser
}

// actions
const actions = {
  setAdminPanelUsers ({ commit }, users) {
    commit(SET_ADMINPANEL_USERS, users)
  },
  setAdminPanelUser ({ commit }, user) {
    commit(SET_ADMINPANEL_USER, user)
  },
  setAdminPanelSearchOptions ({commit}, payload) {
    commit(SET_ADMINPANEL_SEARCH_OPTIONS, payload)
  },
  setAdminPanelNewUserMeta ({commit}, payload) {
    commit(SET_ADMINPANEL_NEWUSER_META, payload)
  },
  resetAdminPanelNewUserMeta ({commit}) {
    commit(RESET_ADMINPANEL_NEWUSER_META)
  }
}

// mutations
const mutations = {
  [SET_ADMINPANEL_USERS] (state, users) {
    state.users = users
  },
  [SET_ADMINPANEL_USER] (state, user) {
    state.user = user
  },
  [SET_ADMINPANEL_SEARCH_OPTIONS] (state, payload) {
    state.searchKey = payload.searchKey || state.searchKey
    state.searchRole = payload.searchRole || state.searchRole
  },
  [SET_ADMINPANEL_NEWUSER_META] (state, payload) {
    state.newUser = {
      name: payload.name || state.newUser.name,
      role: payload.role || state.newUser.role,
      email: payload.email || state.newUser.email,
      schoolId: payload.schoolId || state.newUser.schoolId,
      password: payload.password || state.newUser.password
    }
  },
  [RESET_ADMINPANEL_NEWUSER_META] (state) {
    state.newUser = {
      name: '',
      role: state.newUser.role,
      email: '',
      schoolId: '',
      password: ''
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
