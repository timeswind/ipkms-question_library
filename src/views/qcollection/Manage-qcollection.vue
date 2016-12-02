<template>
  <div id="manage-qcollection">

    <topbar>
      <div class="tabbar">
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'my-qcollection', activeClass: 'tabbar-item-active'}">我的題集</router-link>
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'all-qcollection', activeClass: 'tabbar-item-active' }">所有題集</router-link>
        <router-link tag="span" class="tabbar-item" style="width:33.333333%" :to="{ name: 'search-qcollection', activeClass: 'tabbar-item-active' }">題集搜索</router-link>
      </div>
    </topbar>
    <transition name="fade" mode="out-in">
      <router-view style="margin-top:72px"></router-view>
    </transition>
  </div>
</template>

<script>
import topbar from '../../components/reuseable/Topbar.vue'

export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.path === '/manage-qcollection') {
        this.$router.push({name: 'my-qcollection'})
      }
    })
  },
  components: {
    topbar
  }
}
</script>
