<style>
@media screen and (max-width: 1024px) {
  #topbar {
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,0.35);
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    z-index: 99
  }
}
@media screen and (min-width: 1025px) {
  #topbar {
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,0.35);
    position: fixed;
    top: 64px;
    left: 240px;
    right: 0;
    z-index: 99
  }
}
</style>
<template>
  <div id="topbar">
      <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>
