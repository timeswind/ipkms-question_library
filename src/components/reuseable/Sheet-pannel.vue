<style>
#sheet-pannel {
  background-color: #fff;
  padding: 16px 32px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35)
}

#sheet-pannel .expand-transition {
  max-height: 500px;
  transition: all .3s ease;
  padding: 10px;
  overflow: hidden;
}

#sheet-pannel .expand-enter, #sheet-pannel .expand-leave {
  max-height: 0;
  padding: 0 10px;
  opacity: 0;
}

</style>
<template>
  <div id="sheet-pannel">
    <div class="flex-row flex-center">
      <slot name="sheet-title" ></slot>
      <slot name="sheet-button"></slot>
    </div>
    <div id="sheet-zone" v-show="sheetshow" transition="expand">
      <slot name="sheet-zone"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'sheetshow']
}
</script>
