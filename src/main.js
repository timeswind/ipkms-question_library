/*eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueQuill from './modules/vue-quill/vue-quill.js'
import Filters from './filters/ipkms-filters.js'
// import VueMdl from 'vue-mdl'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css' // 使用 carbon 主题
import store from './vuex/store'

// import 'material-design-lite/material.min.css'
// import 'material-design-lite/material.min.js'

import App from './App'
import auth from './auth'
Vue.use(MuseUI)

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueQuill)
Vue.use(Filters)
// Vue.use(VueMdl)

var language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2)
if (language !== 'zh') {
  language = 'eng'
} else {
  language = 'cht'
}
store.commit('SET_USER_LANGUAGE', language)

if (window.sessionStorage.role) {
  store.commit('SET_USER_ROLE', window.sessionStorage.role)
}


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
  if (request.url && request.url.charAt(0) === '/' && window.sessionStorage.token) {
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

const EntryView = resolve => require(['./views/Entry.vue'], resolve)
const LoginView = resolve => require(['./views/Login.vue'], resolve)
const CreateQuestionView = resolve => require(['./views/create-question/Create-mc-question.vue'], resolve)
const AdminPanelView = r => require.ensure([], () => r(require('./views/AdminPanel/AdminPanel.vue')), 'admin-panel')
const AdminPanelUserDetailView = r => require.ensure([], () => r(require('./views/AdminPanel/UserDetail.vue')), 'admin-panel')

var router = new VueRouter({
  routes: [
    { path: '/', component: EntryView, name: 'entry', meta: { title: '題庫' }, beforeEnter: requireAuthTeacher},
    { path: '/login', component: LoginView, name: 'login', meta: { title: '登入'}},
    { path: '/create-question', component: CreateQuestionView, name: 'create-question', meta: { title: '創建題目'}, beforeEnter: requireAuthTeacher},
    { path: '/manage-qcollection', component: resolve => require(['./views/ManageQcollection/ManageQcollection.vue'], resolve), name: 'manage-qcollection', meta: { title: '管理題集'}, beforeEnter: requireAuthTeacher},
    { path: '/manage-qcollection/detail/:qcollection_id', component: resolve => require(['./views/qcollection/Qcollection-detail.vue'], resolve), name: 'qcollection-detail', meta: { title: '題集內容'}, beforeEnter: requireAuthTeacher},
    { path: '/manage-question', component: resolve => require(['./views/ManageQuestion/ManageQuestion.vue'], resolve), name: 'manage-question', meta: { title: '管理題目'}, beforeEnter: requireAuthTeacher},
    { path: '/manage-question/detail/:question_id', component: resolve => require(['./views/questions/Question-detail.vue'], resolve), name: 'question-detail', meta: { title: '題目詳情'}, beforeEnter: requireAuthTeacher},
    { path: '/manage-quiz', component: resolve => require(['./views/ManageQuickquiz/ManageQuickquiz.vue'], resolve), name: 'manage-quiz', meta: { title: '管理小測'}, beforeEnter: requireAuthTeacher},
    { path: '/quick-quiz', component: resolve => require(['./views/quickquiz/Quick-quiz.vue'], resolve), name: 'quick-quiz', meta: { title: 'Quick Quiz'}, children: [
      { path: 'prepare', name: 'prepare-quiz', component: resolve => require(['./views/quickquiz/Prepare-quiz.vue'], resolve), meta: { title: '準備小測'} },
      { path: 'results', name: 'quiz-results', component: resolve => require(['./views/quickquiz/Quiz-results.vue'], resolve), meta: { title: '數據統計'} },
    ], beforeEnter: requireAuthTeacher},
    { path: '/quick-quiz/detail/:quickquiz_id', component: resolve => require(['./views/quickquiz/Quiz-detail.vue'], resolve), name: 'quiz-detail', meta: { title: 'Quiz Detail'}},
    { path: '/quick-quiz/paper/:quickquiz_id/:quizsample_id', component: resolve => require(['./views/quickquiz/Quiz-paper.vue'], resolve), name: 'quiz-paper', meta: { title: 'Quiz Paper'}, beforeEnter: requireAuthTeacher},
    { path: '/admin', component: AdminPanelView, name: 'admin', meta: { title: 'Admin'}, beforeEnter: requireAuthAdmin},
    { path: '/admin/user/:id', component: AdminPanelUserDetailView, name: 'admin-user-detail', meta: { title: '用戶信息'}, beforeEnter: requireAuthAdmin}
  ]
})

function requireAuthAdmin (to, from, next) {
  if (auth.loggedIn() && auth.getRole() === 'admin') {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
}

function requireAuthTeacher (to, from, next) {
  if (auth.loggedIn() && auth.getRole() === 'teacher') {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
}

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
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
