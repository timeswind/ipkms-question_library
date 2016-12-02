<template>
  <div id="manage-question">
    <topbar>

      <div class="tabbar">
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'my-question', activeClass: 'tabbar-item-active'}">我的題目</router-link>
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'all-question', activeClass: 'tabbar-item-active' }">所有題目</router-link>
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'search-question', activeClass: 'tabbar-item-active' }">題目搜索</router-link>
      </div>

    </topbar>
    <keep-alive>
      <transition name="fade" mode="out-in">
        <router-view style="margin-top:72px"></router-view>
      </transition>
    </keep-alive>

  </div>
</template>

<script>
import topbar from '../../components/reuseable/Topbar.vue'

export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.path === '/manage-question') {
        this.$router.push({name: 'my-question'})
      }
    })
  },
  components: {
    topbar
  }
}
</script>
