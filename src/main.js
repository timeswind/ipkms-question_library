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

import 'vue-toast/dist/vue-toast.min.css'
import vueToast from 'vue-toast'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueQuill)
Vue.use(Filters)
Vue.use(VueMdl)
Vue.component('vue-toast', vueToast)

Vue.prototype.$showToast = function (message) {
  store.dispatch('showToast', message)
}

Vue.prototype.$goBack = function () {
  window.history.back()
}

// var self = this

Vue.http.interceptors.push({

  request: function (request) {
    if (window.sessionStorage.token) {
      request.headers['x-access-token'] = window.sessionStorage.token
    }
    return request
  },
  response: function (response) {
    if (response.status === 401 && response.data.authorize === false) {
      console.log('need relogin')
      store.dispatch('showLoginModal')
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
      require(['./components/manage-qcollection.vue'], resolve)
    },
    title: '管理題集',
    subRoutes: {
      '/my': {
        name: 'my-qcollection',
        component: function (resolve) {
          require(['./components/My-qcollection.vue'], resolve)
        },
        title: '我的題集'
      },
      '/all': {
        name: 'all-qcollection',
        component: function (resolve) {
          require(['./components/All-qcollection.vue'], resolve)
        },
        title: '所有題集'
      }
    }
  },
  '/manage-qcollection/detail/:qcollection_id': {
    name: 'qcollection-detail',
    component: function (resolve) {
      require(['./components/Qcollection-detail.vue'], resolve)
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
  '/quick-quiz/paper/:quickquiz_id': {
    name: 'quiz-paper',
    component: function (resolve) {
      require(['./views/quickquiz/Quiz-paper.vue'], resolve)
    },
    title: 'Quiz Paper'
  }
})

router.start(App, '#app')
