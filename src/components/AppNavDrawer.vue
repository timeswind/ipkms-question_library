<template>
  <mu-drawer @hide="handleHide" @close="handleClose" :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="exmaples-nav-appbar" :zDepth="0">
      <a class="exmaples-appbar-title" @click="handleMenuChange('entry')" style="display:inline-block;">IPKMS-題庫</a>
      <mu-badge content="bata" class="exmaples-version" secondary/>
    </mu-appbar>
    <mu-divider/>
    <mu-list @change="handleMenuChange" :value="menuVal">
      <div v-if="userRole === 'teacher'">
        <mu-list-item value="create-question" title="創建題目"/>
        <mu-list-item value="manage-question" title="管理題目"/>
        <mu-list-item value="manage-qcollection" title="管理題集"/>
        <mu-list-item value="manage-quiz" title="Quick quiz"/>
      </div>
      <div v-if="userRole === 'admin'">
        <mu-list-item value="admin" title="Admin Panel"/>
      </div>
    </mu-list>
    <mu-divider/>
  </mu-drawer>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: true
    },
    docked: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      menuVal: '#/'
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    handleMenuChange (val) {
      this.menuVal = val
      if (this.docked) {
        this.$router.push({name: this.menuVal})
      } else {
        this.changeHref = true
      }
      this.$emit('change', val)
    },
    handleHide () {
      if (!this.changeHref) return
      window.location.hash = this.menuVal
      this.changeHref = false
    }
  },
  mounted () {
    this.menuVal = window.location.hash
  },
  computed: {
    userRole () {
      return this.$store.getters.getUserRole
    }
  }
}
</script>

<style>
.exmaples-drawer{
  box-shadow: none;
  border-right: 1px solid #ddd;
}
.exmaples-nav-appbar.mu-appbar{
  background-color: #fff;
  color: #ddd;
}
.exmaples-appbar-title{
  color: #333;
}
.exmaples-version {
  margin-left: 10px;
  vertical-align: text-top;
}
.exmaples-nav-sub-header {
  padding-left: 34px;
}
.mu-version-box{
  height: 48px;
  margin-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
}
.mu-version-text {
  font-size: 16px;
  margin-top: 8px;
}
</style>
