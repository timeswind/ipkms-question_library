<style>
#toast {
  z-index: 9998;
  position: relative;
  bottom: 0;
  left: 50%;
  padding: 12px 24px;
  min-width: 100px;
  text-align: center;
  background-color: #323232;
  color: #fff;
}

</style>
<template>
  <div id="toast" v-show="show" transition="toast">
    {{message}}
  </div>
</template>

<script>
export default {
  ready () {
    let self = this
    setTimeout(function () {
      self.$remove().$destroy()
    }, 5000)
  },
  beforeDestroy () {
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      required: true
    }
  }
}
</script>
