<template>
  <div>
    <mu-linear-progress v-show="loadingIndicatorShow" style="position: absolute; top: 0;z-index: 999" :size="3" color="#ff5252"/>
    <mu-appbar :title="$route.meta.title" class="example-appbar" :class="{'nav-hide': !navOpen}">
      <mu-icon-button icon='menu' slot="left" @click="toggleNav"/>
    </mu-appbar>
    <mu-drawer :open="false" @close="toggle()">
      <div class="flex-column">
        <router-link :to="{name:'create-question', activeClass:'active'}">創建題目</router-link>
        <router-link :to="{name:'manage-question', activeClass:'active'}">管理題目</router-link>
        <router-link :to="{name:'manage-qcollection', activeClass:'active'}">管理題集</router-link>
        <router-link :to="{name:'quick-quiz', activeClass:'active'}">Quick Quiz</router-link>
      </div>
    </mu-drawer>
    <div class="example-content" :class="{'nav-hide': !navOpen}">
      <router-view></router-view>
    </div>
    <app-nav @change="handleMenuChange" @close="toggleNav" :open="navOpen" :docked="navDocked" />
    <mu-toast v-if="toastState" :message="toastState"/>
    <mu-dialog :open="loginModalShow" title="重新登入">
      <div class="flex-column">
        <span style="color: #E91E63; margin-top: 4px; margin-bottom: 8px;">登入信息过期</span>
        <mu-text-field label="學校" hintText="學校" v-model="reLogin.school" type="email"/>
        <mu-text-field label="郵箱" hintText="郵箱" v-model="reLogin.email" type="email"/>
        <mu-text-field label="密碼" hintText="密碼" v-model="reLogin.password" type="password"/>
        <span style="color: #F44336;text-align: center;">{{reLogin.warn}}</span>
        <mu-raised-button label="登入" slot="actions" primary @click.native="login()"/>
      </div>
    </mu-dialog>
    <qcollection-selector-dialog/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import qcollectionSelectorDialog from './components/QcollectionSelectorDialog/QcollectionSelectorDialog.vue'
import AppNavDrawer from './components/AppNavDrawer'
import './css/main.css'
import './css/animation.css'

export default {
  data () {
    const desktop = isDesktop()
    return {
      reLogin: {
        school: '',
        email: '',
        password: '',
        warn: ''
      },
      navOpen: desktop,
      navDocked: desktop,
      desktop: desktop
    }
  },
  mounted () {
    this.routes = this.$router.options.routes
    this.changeNav()
    this.handleResize = () => {
      this.changeNav()
    }
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  components: {
    'qcollection-selector-dialog': qcollectionSelectorDialog,
    'app-nav': AppNavDrawer
  },
  methods: {
    login: function () {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      if (re.test(this.reLogin.email)) {
        let data = {
          school: this.reLogin.school,
          email: this.reLogin.email,
          password: this.reLogin.password
        }
        this.$http.post('/api/login', data).then(function (response) {
          if (response.status === 200 && response.data && response.data.token) {
            window.sessionStorage.token = response.data.token
            window.sessionStorage.role = response.data.role
            this.setUserRole(response.data.role)
            this.hideLoginModal()
            this.reLogin.email = ''
            this.reLogin.password = ''
            this.reLogin.warn = ''
            if (response.data.role === 'admin') {
              this.$router.push({name: 'admin'})
            } else {
              this.$router.push({name: 'entry'})
            }
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
    },
    changeNav () {
      const desktop = isDesktop()
      this.navDocked = desktop
      if (desktop === this.desktop) return
      if (!desktop && this.desktop && this.navOpen) {
        this.navOpen = false
      }
      if (desktop && !this.desktop && !this.navOpen) {
        this.navOpen = true
      }
      this.desktop = desktop
    },
    toggleNav () {
      this.navOpen = !this.navOpen
    },
    handleMenuChange (path) {
      if (!this.desktop) this.navOpen = false
    },
    ...mapActions({
      hideLoginModal: 'hideLoginModal',
      setUserRole: 'setUserRole'
    })
  },
  computed: mapGetters({
    loginModalShow: 'getLoginModalState',
    loadingIndicatorShow: 'getLoadingIndicatorState',
    toastState: 'getToastState'
  })
}
function isDesktop () {
  return window.innerWidth > 993
}
</script>
<style>
body {
  align-items: center;
  justify-content: center;
  margin:0;
  background-color: #fafafa
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
.example-appbar{
  position: fixed;
  left: 256px;
  right: 0;
  top: 0;
  width: auto;
  transition: all .45s cubic-bezier(.23,1,.32,1);
  z-index: 998;
}
.example-appbar.nav-hide {
  left: 0;
}
.example-content{
  padding-top: 56px;
  padding-left: 256px;
  transition: all .45s cubic-bezier(.23,1,.32,1)
}
.example-content.nav-hide {
  padding-left: 0;
}
.content-wrapper{
  padding: 48px 72px;
}
@media (min-width: 480px) {
  .example-content{
    padding-top: 64px;
  }
}
@media (max-width: 993px) {
  .example-appbar {
    left: 0;
  }
  .example-content{
    padding-left: 0;
  }
  .content-wrapper {
    padding: 24px 36px;
  }
}
</style>
