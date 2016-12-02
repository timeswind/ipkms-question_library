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
  <transition name="toast">
    <div id="toast" v-show="show">
      {{message}}
    </div>
  </transition>
</template>

<script>
export default {
  mounted: function () {
    this.$nextTick(function () {
      let self = this
      setTimeout(function () {
        self.$el.remove()
      }, 5000)
    })
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
