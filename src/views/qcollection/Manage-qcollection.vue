<template>
  <div id="manage-qcollection">

    <topbar>
      <div class="tabbar">
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'my-qcollection', activeClass: 'tabbar-item-active'}">我的題集</span>
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'all-qcollection', activeClass: 'tabbar-item-active' }">所有題集</span>
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'search-qcollection', activeClass: 'tabbar-item-active' }">題集搜索</span>
      </div>
    </topbar>

    <router-view :is="view" transition="fade" transition-mode="out-in" style="margin-top:72px"></router-view>

  </div>
</template>

<script>
import topbar from '../../components/reuseable/Topbar.vue'

export default {
  attached () {
    if (this.$route.path === '/manage-qcollection') {
      this.$router.go({name: 'my-qcollection'})
    }
  },
  components: {
    topbar
  }
}
</script>
