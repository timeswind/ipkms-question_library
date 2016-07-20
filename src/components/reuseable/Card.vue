<style>
.card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
</style>

<template>
  <div>
    <div class="card">
      <slot name="content"></slot>
    </div>
  </div>

</template>

<script>
export default {
  props: {

  }
}
</script>
