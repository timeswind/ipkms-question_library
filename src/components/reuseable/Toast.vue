<style>
#toast {
  z-index: 9998;
  position: fixed;
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
import '../../css/animation.css'

export default {
  props: {
    show: false,
    message: ''
  }
}
</script>
