<template>
  <div id="manage-question">
    <topbar>

      <div class="tabbar">
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'my-question', activeClass: 'tabbar-item-active'}">我的題目</span>
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'all-question', activeClass: 'tabbar-item-active' }">所有題目</span>
        <span class="tabbar-item" style="width:33.333333%" v-link="{ name: 'search-question', activeClass: 'tabbar-item-active' }">題目搜索</span>
      </div>

    </topbar>

    <router-view :is="view" transition="fade" transition-mode="out-in" style="margin-top:72px"></router-view>

  </div>
</template>

<script>
import topbar from './reuseable/Topbar.vue'

export default {
  attached () {
    if (this.$route.path === '/manage-question') {
      this.$router.go({name: 'my-question'})
    }
  },
  components: {
    topbar
  }
}
</script>
