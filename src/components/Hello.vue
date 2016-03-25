<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <mdl-checkbox :checked.sync="check">Checkbox</mdl-checkbox>
    <p>{{ check }}</p>
  </div>
</template>

<script>
import vmdl from 'vue-mdl'
import Vue from 'vue'

vmdl.register(Vue, 'mdlCheckbox')
vmdl.register(Vue, 'mdlButton')

var checkbox = vmdl.components['mdlCheckbox']
var button = vmdl.components['mdlButton']

export default {
  ready: function () {
    this.$http.get('/api/manage-question/latest').then(function (response) {
      console.log(response)
    }, function (response) {
      console.log(response)
    })
  },
  components: {
    mdlButton: button,
    mdlCheckbox: checkbox
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      check: true,
      msg: 'Hello World!'
    }
  }
}
</script>
