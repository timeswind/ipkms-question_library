import Vue from 'vue'
import Vuex from 'vuex'
import utilities from './modules/utilities'
import quickquiz from './modules/quickquiz'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    utilities,
    quickquiz
  },
  strict: debug
})
