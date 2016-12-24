import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import utilities from './modules/utilities'
import quizDashboard from './modules/QuizDashboard'
import quizpaper from './modules/quizpaper'
import qcollectionSelector from './modules/qcollection-selector'
import newQuestionForm from './modules/NewQuestionForm'
import adminPanel from './modules/AdminPanel'
import quiz from './modules/quiz'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    utilities,
    quizDashboard,
    quizpaper,
    qcollectionSelector,
    newQuestionForm,
    adminPanel,
    quiz
  },
  strict: debug
})
