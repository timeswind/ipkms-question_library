<template>
  <div id="create-question">

    <router-view :is="view" transition="fade" transition-mode="out-in"></router-view>

  </div>
</template>
<script>
export default {
  attached () {
    if (this.$route.path === '/create-question') {
      this.$router.go({name: 'start-create-question'})
    }
  }
}
</script>
