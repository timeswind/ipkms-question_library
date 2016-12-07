import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import utilities from './modules/utilities'
import quickquiz from './modules/quickquiz'
import quizpaper from './modules/quizpaper'
import qcollectionSelector from './modules/qcollection-selector'
import newQuestionForm from './modules/NewQuestionForm'
import adminPanel from './modules/AdminPanel'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    utilities,
    quickquiz,
    quizpaper,
    qcollectionSelector,
    newQuestionForm,
    adminPanel
  },
  strict: debug
})
