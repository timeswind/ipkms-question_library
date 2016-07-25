import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueQuill from './modules/vue-quill/vue-quill.js'
import Filters from './filters/ipkms-filters.js'
import VueMdl from 'vue-mdl'
import store from './vuex/store'

import 'material-design-lite/material.min.css'
import 'material-design-lite/material.min.js'

import App from './App'

Vue.config.debug = true

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueQuill)
Vue.use(Filters)
Vue.use(VueMdl)

var language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2)
if (language !== 'zh') {
  language = 'eng'
} else {
  language = 'cht'
}
store.dispatch('SET_USER_LANGUAGE', language)

Vue.prototype.$showToast = function (message) {
  store.dispatch('SHOW_TOAST', message)
}

Vue.prototype.$goBack = function () {
  window.history.back()
}

// var self = this

var stopReceivingResponseTimer = null

function hideLoginIncicator () {
  store.dispatch('HIDE_LOADING_INDICATOR')
}

Vue.http.interceptors.push({

  request: function (request) {
    store.dispatch('SHOW_LOADING_INDICATOR')
    if (window.sessionStorage.token) {
      request.headers['x-access-token'] = window.sessionStorage.token
    }
    return request
  },
  response: function (response) {
    clearTimeout(stopReceivingResponseTimer)
    stopReceivingResponseTimer = setTimeout(hideLoginIncicator, 1500)
    if (response.status === 401 && response.data.authorize === false) {
      console.log('need relogin')
      store.dispatch('SHOW_LOGIN_MODAL')
    }

    return response
  }

})

var router = new VueRouter()

router.map({
  '/': {
    name: 'entry',
    component: function (resolve) {
      require(['./views/Entry.vue'], resolve)
    },
    title: '題庫'
  },
  '/create-question': {
    name: 'create-question',
    component: function (resolve) {
      require(['./views/create-question/Create-question.vue'], resolve)
    },
    title: '創建題目',
    subRoutes: {
      '/start': {
        name: 'start-create-question',
        component: function (resolve) {
          require(['./views/create-question/Start.vue'], resolve)
        },
        title: 'Start'
      },
      '/mc': {
        name: 'create-mc-question',
        component: function (resolve) {
          require(['./views/create-question/Create-mc-question.vue'], resolve)
        },
        title: '多項選擇題'
      },
      '/mc_question_set': {
        name: 'create-mc-question-set',
        component: function (resolve) {
          require(['./views/create-question/Create-mc-question-set.vue'], resolve)
        },
        title: '多項選擇題 題集'
      }
    }
  },
  '/manage-qcollection': {
    name: 'manage-qcollection',
    component: function (resolve) {
      require(['./views/qcollection/manage-qcollection.vue'], resolve)
    },
    title: '管理題集',
    subRoutes: {
      '/my': {
        name: 'my-qcollection',
        component: function (resolve) {
          require(['./views/qcollection/My-qcollection.vue'], resolve)
        },
        title: '我的題集'
      },
      '/all': {
        name: 'all-qcollection',
        component: function (resolve) {
          require(['./views/qcollection/All-qcollection.vue'], resolve)
        },
        title: '所有題集'
      },
      '/search': {
        name: 'search-qcollection',
        component: function (resolve) {
          require(['./views/qcollection/Search-qcollection.vue'], resolve)
        },
        title: '搜索題集'
      }
    }
  },
  '/manage-qcollection/detail/:qcollection_id': {
    name: 'qcollection-detail',
    component: function (resolve) {
      require(['./views/qcollection/Qcollection-detail.vue'], resolve)
    },
    title: '題集內容'

  },
  '/manage-question': {
    name: 'manage-question',
    component: function (resolve) {
      require(['./components/Manage-question.vue'], resolve)
    },
    title: '管理題目',
    subRoutes: {
      '/my': {
        name: 'my-question',
        component: function (resolve) {
          require(['./components/My-question.vue'], resolve)
        },
        title: '我的題目'
      },
      '/all': {
        name: 'all-question',
        component: function (resolve) {
          require(['./components/All-question.vue'], resolve)
        },
        title: '所有題目'
      },
      '/search': {
        name: 'search-question',
        component: function (resolve) {
          require(['./components/Search-question.vue'], resolve)
        },
        title: '搜索題目'
      }
    }
  },
  '/manage-question/detail/:question_id': {
    name: 'question-detail',
    component: function (resolve) {
      require(['./components/Question-detail.vue'], resolve)
    },
    title: '题目內容'

  },
  '/quick-quiz': {
    name: 'quick-quiz',
    component: function (resolve) {
      require(['./views/quickquiz/Quick-quiz.vue'], resolve)
    },
    title: 'Quick Quiz',
    subRoutes: {
      '/prepare': {
        name: 'prepare-quiz',
        component: function (resolve) {
          require(['./views/quickquiz/Prepare-quiz.vue'], resolve)
        },
        title: '準備小測'
      },
      '/results': {
        name: 'quiz-results',
        component: function (resolve) {
          require(['./views/quickquiz/Quiz-results.vue'], resolve)
        },
        title: '數據統計'
      }
    }
  },
  '/quick-quiz/detail/:quickquiz_id': {
    name: 'quiz-detail',
    component: function (resolve) {
      require(['./views/quickquiz/Quiz-detail.vue'], resolve)
    },
    title: 'Quiz Detail'
  },
  '/quick-quiz/paper/:quickquiz_id/:quizsample_id': {
    name: 'quiz-paper',
    component: function (resolve) {
      require(['./views/quickquiz/Quiz-paper.vue'], resolve)
    },
    title: 'Quiz Paper'
  }

})

router.start(App, '#app')
