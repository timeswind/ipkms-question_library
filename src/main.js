/*eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueQuill from './modules/vue-quill/vue-quill.js'
import Filters from './filters/ipkms-filters.js'
import VueMdl from 'vue-mdl'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css' // 使用 carbon 主题
import store from './vuex/store'

import 'material-design-lite/material.min.css'
import 'material-design-lite/material.min.js'

import App from './App'
Vue.use(MuseUI)

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
store.commit('SET_USER_LANGUAGE', language)


var hideToastTimer = null
var stopReceivingResponseTimer = null

function hideLoginIncicator () {
  store.commit('HIDE_LOADING_INDICATOR')
}
function hideToast () {
  store.commit('HIDE_TOAST')
}

Vue.prototype.$showToast = function (message) {
  store.commit('SHOW_TOAST', message)
  clearTimeout(hideToastTimer)
  hideToastTimer = setTimeout(hideToast, 1500)
}

Vue.prototype.$goBack = function () {
  window.history.back()
}

// var self = this

Vue.http.interceptors.push((request, next) => {
  // modify request
  store.commit('SHOW_LOADING_INDICATOR')
  if (request.url.charAt(0) === '/' && window.sessionStorage.token) {
    request.headers.set('x-access-token',window.sessionStorage.token)
  }
  // continue to next interceptor
  next((response) => {
    // modify response
    clearTimeout(stopReceivingResponseTimer)
    stopReceivingResponseTimer = setTimeout(hideLoginIncicator, 1500)
    if (response.status === 401 && response.data.authorize === false) {
      store.commit('SHOW_LOGIN_MODAL')
    }
  })
})

// Vue.http.interceptors.push({
//
//   request: function (request) {
//     store.commit('SHOW_LOADING_INDICATOR')
//     if (request.url.charAt(0) === '/' && window.sessionStorage.token) {
//       request.headers['x-access-token'] = window.sessionStorage.token
//     }
//     return request
//   },
//   response: function (response) {
//     clearTimeout(stopReceivingResponseTimer)
//     stopReceivingResponseTimer = setTimeout(hideLoginIncicator, 1500)
//     if (response.status === 401 && response.data.authorize === false) {
//       store.commit('SHOW_LOGIN_MODAL')
//     }
//
//     return response
//   }
//
// })
const EntryView = resolve => require(['./views/Entry.vue'], resolve)
const LoginView = resolve => require(['./views/Login.vue'], resolve)
const CreateQuestionView = resolve => require(['./views/create-question/Create-question.vue'], resolve)

var router = new VueRouter({
  routes: [
    { path: '/', component: EntryView, name: 'entry', meta: { title: '題庫' }},
    { path: '/login', component: LoginView, name: 'login', meta: { title: '登入'}},
    { path: '/create-question', component: CreateQuestionView, name: 'create-question', meta: { title: '創建題目'}, children: [
      { path: 'start', name: 'start-create-question', component: resolve => require(['./views/create-question/Start.vue'], resolve), meta: { title: 'Start'} },
      { path: 'mc', name: 'create-mc-question', component: resolve => require(['./views/create-question/Create-mc-question.vue'], resolve), meta: { title: '多項選擇題'} },
      { path: 'mc_question_set', name: 'create-mc-question-set', component: resolve => require(['./views/create-question/Create-mc-question-set.vue'], resolve), meta: { title: '多項選擇題 題集'} }
    ]},
    { path: '/manage-qcollection', component: resolve => require(['./views/ManageQcollection/ManageQcollection.vue'], resolve), name: 'manage-qcollection', meta: { title: '管理題集'}},
    { path: '/manage-qcollection-legacy', component: resolve => require(['./views/qcollection/manage-qcollection.vue'], resolve), name: 'manage-qcollection-legacy', meta: { title: '管理題集'}, children: [
      { path: 'my', name: 'my-qcollection', component: resolve => require(['./views/qcollection/My-qcollection.vue'], resolve), meta: { title: '我的題集'} },
      { path: 'all', name: 'all-qcollection', component: resolve => require(['./views/qcollection/All-qcollection.vue'], resolve), meta: { title: '所有題集'} },
      { path: 'search', name: 'search-qcollection', component: resolve => require(['./views/qcollection/Search-qcollection.vue'], resolve), meta: { title: '搜索題集'} }
    ]},
    { path: '/manage-qcollection/detail/:qcollection_id', component: resolve => require(['./views/qcollection/Qcollection-detail.vue'], resolve), name: 'qcollection-detail', meta: { title: '題集內容'}},
    { path: '/manage-question', component: resolve => require(['./views/ManageQuestion/ManageQuestion.vue'], resolve), name: 'manage-question', meta: { title: '管理題目'}},
    { path: '/manage-question/detail/:question_id', component: resolve => require(['./views/questions/Question-detail.vue'], resolve), name: 'question-detail', meta: { title: '題目詳情'}},
    { path: '/quick-quiz', component: resolve => require(['./views/quickquiz/Quick-quiz.vue'], resolve), name: 'quick-quiz', meta: { title: 'Quick Quiz'}, children: [
      { path: 'prepare', name: 'prepare-quiz', component: resolve => require(['./views/quickquiz/Prepare-quiz.vue'], resolve), meta: { title: '準備小測'} },
      { path: 'results', name: 'quiz-results', component: resolve => require(['./views/quickquiz/Quiz-results.vue'], resolve), meta: { title: '數據統計'} },
    ]},
    { path: '/quick-quiz/detail/:quickquiz_id', component: resolve => require(['./views/quickquiz/Quiz-detail.vue'], resolve), name: 'quiz-detail', meta: { title: 'Quiz Detail'}},
    { path: '/quick-quiz/paper/:quickquiz_id/:quizsample_id', component: resolve => require(['./views/quickquiz/Quiz-paper.vue'], resolve), name: 'quiz-paper', meta: { title: 'Quiz Paper'}}
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (window.sessionStorage.token) {
      next()
    } else {
      router.push({name: 'login'})
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  store,
  router: router,
  ...App
})
