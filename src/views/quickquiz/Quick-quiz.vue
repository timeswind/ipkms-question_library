<template>
  <div id="quick-quiz">
    <topbar>

      <div class="tabbar">
        <router-link tag="span" class="tabbar-item" style="width:50%" :to="{ name: 'prepare-quiz', activeClass: 'tabbar-item-active'}">準備小測</router-link>
        <router-link tag="span" class="tabbar-item" style="width:50%" :to="{ name: 'quiz-results', activeClass: 'tabbar-item-active' }">數據統計</router-link>
      </div>

    </topbar>
    <keep-alive>
      <transition name="fade" mode="out-in">
        <router-view style="margin-top:52px"></router-view>
      </transition>
    </keep-alive>

  </div>
</template>

<script>
import topbar from '../../components/reuseable/Topbar.vue'

export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.path === '/quick-quiz') {
        this.$router.push({name: 'prepare-quiz'})
      }
    })
  },
  components: {
    topbar
  }
}
</script>
