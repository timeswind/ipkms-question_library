<template>
  <div id="app" style="height:100%">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
      <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
          <span class="mdl-layout-title" v-show="$route.matched.length > 1">
            {{$route.matched[0].handler.title}}
          </span>
          <i class="material-icons" v-show="$route.matched.length > 1">keyboard_arrow_right</i>
          <span class="mdl-layout-title">{{$route.title}}</span>
        </div>
      </header>
      <div class="mdl-layout__drawer">
        <span class="mdl-layout-title" style="cursor: pointer" v-link="{name:'entry'}">題庫</span>
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{name:'start-create-question', activeClass:'active'}">創建題目</a>
          <a class="mdl-navigation__link" v-link="{name:'manage-question', activeClass:'active'}">管理題目</a>
          <a class="mdl-navigation__link" v-link="{name:'manage-qcollection', activeClass:'active'}">管理題集</a>
          <a class="mdl-navigation__link" v-link="{name:'quick-quiz', activeClass:'active'}">Quick Quiz</a>
        </nav>
      </div>
      <main class="mdl-layout__content">
        <div class="page-content">
          <router-view :is="view" transition="fade" transition-mode="out-in"></router-view>
        </div>
      </main>
    </div>

    <mdl-snackbar display-on="toastOn"></mdl-snackbar>
    <mdl-spinner id="mainLoadingIndicator" single-color :active="loadingIndicatorShow"></mdl-spinner>
    <div v-show="loginModalShow" class="login-modal-mask" transition="modal">
      <div class="login-modal-card flex-column">
        <span style="color: #E91E63;
        margin-top: 4px;
        margin-bottom: 8px;">登入信息过期</span>
        <h4 class="display-1" style="margin-top:0">重新登入</h4>
        <mdl-textfield floating-label="郵箱" :value.sync="reLogin.email" type="email"></mdl-textfield>
        <mdl-textfield floating-label="密碼" :value.sync="reLogin.password" type="password" @keyup.enter="login()"></mdl-textfield>
        <span style="color: #F44336;text-align: center;">{{reLogin.warn}}</span>
        <mdl-button raised primary @click="login()" style="margin-top:16px">登入</mdl-button>
      </div>
    </div>
  </div>
</template>

<script>
import store from './vuex/store'
import { hideLoginModal, hideLodingIndicator } from './vuex/actions'
import { getLoginModalState, getLoadingIndicatorState, getToastState } from './vuex/getters'

import './css/main.css'
import './css/animation.css'

export default {
  data () {
    return {
      reLogin: {
        email: '',
        password: '',
        warn: ''
      }
    }
  },
  methods: {
    login: function () {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      if (re.test(this.reLogin.email)) {
        let data = {
          email: this.reLogin.email,
          password: this.reLogin.password
        }
        this.$http.post('/login', data).then(function (response) {
          console.log(response)
          if (response.status === 200 && response.data && response.data.token) {
            window.sessionStorage.token = response.data.token
            this.reLogin.email = ''
            this.reLogin.password = ''
            this.reLogin.warn = ''
            this.hideLoginModal()
            window.location.reload()
          }
        }, function (response) {
          if (response.status === 401 && response.data === 'fail') {
            this.reLogin.password = ''
            this.reLogin.warn = '登入失败'
          }
        })
      } else {
        this.reLogin.warn = '請輸入正確的郵箱地址'
      }
    }
  },
  store,
  vuex: {
    actions: {
      hideLoginModal: hideLoginModal,
      hideLodingIndicator: hideLodingIndicator
    },
    getters: {
      loginModalShow: getLoginModalState,
      loadingIndicatorShow: getLoadingIndicatorState,
      toastState: getToastState
    }
  },
  watch: {
    'toastState': function (val) {
      this.$broadcast('toastOn', { message: val })
    }
  }
}
</script>

<style>
html {
  height: 100%;
  background: #eee;
}

body {
  align-items: center;
  justify-content: center;
  height: 100%;
  margin:0
}

.login-modal-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background: rgba(33, 33, 33, 0.43);
}

.login-modal-card {
  background: #fff;
  max-width: 300px;
  margin: 80px auto 0 auto;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35);
  padding: 16px;
  border-radius: 3px;
}
</style>
