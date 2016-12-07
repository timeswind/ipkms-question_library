<template>
  <div class="user-detail-card">
    <div class="flex-column">
      <span class="field-title">姓名</span>
      <span class="field-content">{{user.name}}</span>
    </div>
    <div class="flex-column">
      <span class="field-title">Role</span>
      <span class="field-content">{{user.role}}</span>
    </div>
    <div class="flex-column" v-if="user.role === 'teacher'">
      <span class="field-title">郵箱</span>
      <span class="field-content">{{user.email}}</span>
    </div>
    <div class="flex-column" v-if="user.role === 'student'">
      <span class="field-title">學號</span>
      <span class="field-content">{{user.schoolId}}</span>
    </div>
    <div class="flex-row flex-center">
      <mu-text-field label="重置密碼" labelFloat v-model="password" type="password"/>
      <mu-raised-button primary label="重置密碼" style="margin: 0 16px" @click="resetPassword">
    </div>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  mounted () {
    this.$nextTick(function () {
      if (this.$route.params.id) {
        this.getUserInfo()
      }
    })
  },
  data () {
    return {
      password: ''
    }
  },
  methods: {
    getUserInfo () {
      let user_id = this.$route.params.id
      this.$http.get(`/api/manage-account/user/${user_id}`).then((response) => {
        if (response.data.success && response.data.user) {
          this.updateUser(response.data.user)
        }
      })
    },
    resetPassword () {
      if (this.password.length >= 6) {
        let user_id = this.$route.params.id
        let data = {
          password: this.password
        }
        this.$http.post(`/api/manage-account/users/reset-password/${user_id}`, data).then((response) => {
          if (response.data.success) {
            this.$showToast('Success')
          }
        })
      } else {
        this.$showToast('Length of password should be greater then 6')
      }
    },
    ...mapActions({
      updateUser: 'setAdminPanelUser'
    })
  },
  computed: {
    ...mapGetters({
      user: 'adminPanelUserDetail'
    })
  }
}
</script>
<style scoped>
.user-detail-card {
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
  border: 1px solid rgba(0, 0, 0, .09);
  margin: 16px auto;
  max-width: 600px;
  margin: 16px auto;
  padding: 16px;

}
</style>
