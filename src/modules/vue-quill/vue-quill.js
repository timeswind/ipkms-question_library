var Quill = require('./src/Quill.vue')

module.exports = {
  install: function (Vue, options) {
    Vue.component('quill', Quill)
  }
}
