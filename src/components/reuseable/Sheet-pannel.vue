<style>
#sheet-pannel {
  background-color: #fff;
  padding: 16px 32px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35)
}

#sheet-pannel .justify-center {
  justify-content: center;
}

</style>
<template>
  <div id="sheet-pannel">
    <div class="flex-row flex-center" :class="{'justify-center': center}">
      <slot name="sheet-title"></slot>
      <div class="flex-column flex-center">
        <slot name="sheet-button"></slot>
        <slot name="button-subtitle"></slot>
      </div>
    </div>
    <transition name="expand">
      <div id="sheet-zone" v-show="sheetshow">
        <slot name="sheet-zone"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    sheetshow: Boolean,
    center: Boolean
  }
}
</script>
