<template>
  <div id="quick-quiz">
    <topbar>

      <div class="tabbar">
        <span class="tabbar-item" style="width:50%" v-link="{ name: 'prepare-quiz', activeClass: 'tabbar-item-active'}">準備小測</span>
        <span class="tabbar-item" style="width:50%" v-link="{ name: 'quiz-results', activeClass: 'tabbar-item-active' }">數據統計</span>
      </div>

    </topbar>

    <router-view :is="view" transition="fade" transition-mode="out-in" style="margin-top:52px" keep-alive></router-view>

  </div>
</template>

<script>
import topbar from '../../components/reuseable/Topbar.vue'

export default {
  attached () {
    if (this.$route.path === '/quick-quiz') {
      this.$router.go({name: 'prepare-quiz'})
    }
  },
  components: {
    topbar
  }
}
</script>
