<style scoped>
.login-modal-card {
  background: #fff;
  max-width: 300px;
  margin: 80px auto 0 auto;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35);
  padding: 16px;
  border-radius: 3px;
}
</style>
<template>
  <div id="login">
    <div class="main-wrapper">
      <div class="flex-column">

        <div class="login-modal-card flex-column">
          <h4 class="display-1" style="margin-top:0">登入</h4>
          <mdl-textfield floating-label="郵箱" :value.sync="login.email" type="email"></mdl-textfield>
          <mdl-textfield floating-label="密碼" :value.sync="login.password" type="password" @keyup.enter="login()"></mdl-textfield>
          <span style="color: #F44336;text-align: center;">{{login.warn}}</span>
          <mdl-button raised primary @click="auth()" style="margin-top:16px">登入</mdl-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      login: {
        email: '',
        password: '',
        warn: ''
      }
    }
  },
  methods: {
    auth: function () {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      if (re.test(this.login.email)) {
        let data = {
          email: this.login.email,
          password: this.login.password
        }
        this.$http.post('/login', data).then(function (response) {
          console.log(response)
          if (response.status === 200 && response.data && response.data.token) {
            window.sessionStorage.token = response.data.token
            this.login.email = ''
            this.login.password = ''
            this.login.warn = ''
            this.$router.go({name: 'entry'})
          }
        }, function (response) {
          if (response.status === 401 && response.data === 'fail') {
            this.login.password = ''
            this.login.warn = '登入失败'
          }
        })
      } else {
        this.login.warn = '請輸入正確的郵箱地址'
      }
    }
  }
}
</script>
