import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import utilities from './modules/utilities'
import quickquiz from './modules/quickquiz'
import qcollectionSelector from './modules/qcollection-selector'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    utilities,
    quickquiz,
    qcollectionSelector
  },
  strict: debug
})
