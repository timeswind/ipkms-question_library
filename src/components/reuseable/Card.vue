<style>
.card {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  margin: 4px;
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
