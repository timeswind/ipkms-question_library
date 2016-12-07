<template>
  <div>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="manage-users" title="管理用戶"/>
    </mu-tabs>
    <div v-if="activeTab === 'manage-users'">
      <mu-dialog :open="newUserDialogShow" title="創建新用戶" @close="toggleNewUserDialog">
        <div class="flex-row" style="margin-bottom: 16px">
          <mu-radio label="學生" name="newUserRole" nativeValue="student" class="new-user-role-radio" :value="newUser.role" @change="(role) => {handleNewUserMetaChange('role', role)}"/>
          <mu-radio label="教師" name="newUserRole" nativeValue="teacher" class="new-user-role-radio" :value="newUser.role" @change="(role) => {handleNewUserMetaChange('role', role)}"/>
        </div>
        <div v-if="newUser.role === 'teacher'">
          <mu-text-field label="郵箱" labelFloat @change="(email) => {handleNewUserMetaChange('email', email)}" :value="newUser.email"/>
        </div>
        <div v-else>
          <mu-text-field label="學號" labelFloat @change="(schoolId) => {handleNewUserMetaChange('schoolId', schoolId)}" :value="newUser.schoolId"/>
        </div>
        <div>
          <mu-text-field label="姓名" labelFloat @change="(name) => {handleNewUserMetaChange('name', name)}" :value="newUser.name"/>
        </div>
        <div>
          <mu-text-field label="初始密碼" labelFloat @change="(password) => {handleNewUserMetaChange('password', password)}" type="password" :value="newUser.password"/>
        </div>
        <mu-flat-button slot="actions" @click="toggleNewUserDialog" label="取消"/>
        <mu-raised-button slot="actions" @click="createNewUser" primary label="創建"/>
      </mu-dialog>
      <div class="flex-row flex-center" style="margin: 0 16px 0 16px">
        <div class="search-bar">
          <div class="flex-row flex-center">
            <div class="flex-row" style="margin-left: 8px">
              <mu-radio label="學生" name="searchKey" nativeValue="student" class="role-radio" :value="searchRole" @change="handleSearchRoleChange"/>
              <mu-radio label="教師" name="searchKey" nativeValue="teacher" class="role-radio" :value="searchRole" @change="handleSearchRoleChange"/>
            </div>
            <div class="flex-row flex-center">
              <mu-text-field :hintText="searchInputHintText" class="textfield" :value="searchKey" @input="handleSearchKeyChange"/>
              <mu-raised-button primary label="搜索" @click="search()" style="margin-left: auto;margin-right: 16px"/>
            </div>
          </div>
        </div>
        <mu-raised-button primary label="創建新用戶" @click="toggleNewUserDialog" style="margin-left: auto;"/>
      </div>

      <mu-table :showCheckbox="false" class="form">
        <mu-thead>
          <mu-tr>
            <mu-th>#</mu-th>
            <mu-th>Name</mu-th>
            <mu-th>Role</mu-th>
            <mu-th v-if="searchRole === 'teacher'">Email</mu-th>
            <mu-th v-if="searchRole === 'student'">School Id</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="(user, index) in users" :key="user._id" style="cursor: pointer" @click.native="userOnSelect(index)">
            <mu-td>{{index + 1}}</mu-td>
            <mu-td>{{user.name}}</mu-td>
            <mu-td>{{user.role}}</mu-td>
            <mu-td v-if="searchRole === 'teacher'">{{user.email}}</mu-td>
            <mu-td v-if="searchRole === 'student'">{{user.schoolId}}</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      activeTab: 'manage-users',
      searchInputHintText: '姓名或郵箱',
      newUserDialogShow: false
    }
  },
  methods: {
    handleSearchRoleChange (role) {
      if (role === 'teacher') {
        this.searchInputHintText = '姓名或郵箱'
      } else {
        this.searchInputHintText = '姓名或學號'
      }
      this.updateSearchOptions({searchRole: role})
    },
    handleNewUserMetaChange (key, data) {
      var update = {}
      update[key] = data
      this.updateNewUserMeta(update)
    },
    handleSearchKeyChange (key) {
      this.updateSearchOptions({searchKey: key})
    },
    handleTabChange (val) {
      this.activeTab = val
    },
    search () {
      let key = this.searchKey
      if (key !== '') {
        var apiURL
        if (this.searchRole === 'teacher') {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (re.test(key)) {
            apiURL = '/api/manage-account/teachers?email=' + key
          } else {
            apiURL = '/api/manage-account/teachers?name=' + key
          }
        } else if (this.searchRole === 'student') {
          if (isNaN(key)) {
            apiURL = '/api/manage-account/students?name=' + key
          } else {
            apiURL = '/api/manage-account/students?schoolId=' + key
          }
        }
        this.$http.get(apiURL).then((response) => {
          if (response.data.success && response.data.users) {
            this.updateUsers(response.data.users)
            this.$showToast('獲取用戶')
          }
        })
      }
    },
    createNewUser () {
      this.$http.post('/api/manage-account/users', this.newUser).then((response) => {
        if (response.data.success) {
          this.newUserDialogShow = false
          this.resetNewUserMeta()
          this.$showToast('創建用戶成功')
        }
      }, (error) => {
        this.$showToast(`!!${error.data}!!`)
      })
    },
    toggleNewUserDialog () {
      this.newUserDialogShow = !this.newUserDialogShow
    },
    userOnSelect (index) {
      this.updateSelectedUser(this.users[index])
      this.$router.push({name: 'admin-user-detail', params: {id: this.users[index]._id}})
    },
    ...mapActions({
      updateSelectedUser: 'setAdminPanelUser',
      updateUsers: 'setAdminPanelUsers',
      updateSearchOptions: 'setAdminPanelSearchOptions',
      updateNewUserMeta: 'setAdminPanelNewUserMeta',
      resetNewUserMeta: 'resetAdminPanelNewUserMeta'
    })
  },
  computed: {
    ...mapGetters({
      users: 'adminPanelUsers',
      searchKey: 'adminPanelSearchKey',
      searchRole: 'adminPanelSearchRole',
      newUser: 'adminPanelNewUser'
    })
  }
}
</script>
<style scoped>
.search-bar {
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
  border: 1px solid rgba(0, 0, 0, .09);
  margin: 16px 0;
  display: inline-block;
}
.search-bar .textfield {
  margin: 0 16px
}
.role-radio {
  margin: 0 8px;
}
.new-user-role-radio {
  margin: 0 16px 0 0;
}
.form {
  border: 1px solid #ddd
}
.new-user-form {
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
  border: 1px solid rgba(0, 0, 0, .09);
  margin: 16px auto;
  max-width: 600px;
}
</style>
