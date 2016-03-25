var Quill = require('./src/Quill.vue')
var render = require('quill-render')

module.exports = {
  install: function (Vue, options) {
    Vue.component('quill', Quill)

    render.format.inline.underline = function ($) {
      return $('<u>')
    }

    Vue.filter('quill', function (value) {
      return render(value.ops)
    })
  }
}
