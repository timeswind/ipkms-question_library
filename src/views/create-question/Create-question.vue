<template>
  <div id="create-question">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.path === '/create-question') {
        this.$router.push({name: 'start-create-question'})
      }
    })
  }
}
</script>
