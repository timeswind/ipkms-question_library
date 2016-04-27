<style>
.card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.card-flex {
  display: flex;
  align-items: baseline;
  flex-direction: row;
}

.card .context-wrapper{
  padding: 16px;
}
</style>

<template>
  <div>
    <div class="card" :class="{'card-flex': flex}">
      <slot name="out"></slot>
      <div class="context-wrapper">
        <div><slot name="in"></slot></div>
      </div>
      <slot name="out-below"></slot>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    flex: false
  }
}
</script>
