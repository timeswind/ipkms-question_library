<template>
  <div>
    <div v-el:toolbar class="ui top attached menu toolbar ql-toolbar ql-snow">
      <slot name="toolbar">
        <div class="ql-format-group">
          <a class="ql-format-button ql-bold"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-underline"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-italic"></a>
        </div>
        <div class="ql-format-group">
          <a class="ql-format-button ql-list"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-bullet"></a>
          <span class="ql-format-separator"></span>

          <a class="insert-math-button" @click="mathBox.show = !mathBox.show">輸入公式</a>
        </div>
      </slot>
    </div>
    <div v-show="mathBox.show" class="math-input flex-column" style="border-bottom: 1px solid #ddd;padding:8px">
      <span v-el:mathquillbox></span>
      <button type="button" @click="insertMath(mathBox.enteredMath)" style="margin-top:8px">插入公式</button>
    </div>
    <div class="ui attached segment" v-el:quill @click.prevent="focusEditor"></div>
  </div>
</template>

<script>
const Quill = require('quill')
const MQ = window.MathQuill.getInterface(2)
export default {
  props: {
    content: {},
    author: {},
    formats: {
      type: Array,
      default () {
        return []
      }
    },
    keyBindings: {
      type: Array,
      default () {
        return []
      }
    },
    output: {
      default: 'delta'
    },
    keyup: {
      default: null
    }
  },
  data () {
    return {
      editor: {},
      mathBox: {
        show: false,
        enteredMath: ''
      }
    }
  },
  ready () {
    var self = this
    var mathinput = this.$els.mathquillbox
    var MathField = MQ.MathField(mathinput, {
      handlers: {
        edit: function () {
          self.mathBox.enteredMath = MathField.latex() // Get entered math in LaTeX format
        }
      }
    })
    this.editor = new Quill(this.$els.quill, {
      modules: { toolbar: this.$els.toolbar, 'link-tooltip': true },
      theme: 'snow'
    })
    this.formats.map((format) => {
      this.editor.addFormat(format.name, format.options)
    })
    if (this.output !== 'delta') {
      this.editor.setHTML(this.content)
    } else {
      this.editor.setContents(this.content)
    }
    this.editor.on('text-change', (delta, source) => {
      this.$dispatch('text-change', this.editor, delta, source)
      this.content = this.output !== 'delta' ? this.editor.getHTML() : this.editor.getContents()
    })
    this.editor.on('selection-change', (range) => {
      this.$dispatch('selection-change', this.editor, range)
    })
    if (typeof this.author !== 'undefined') {
      this.editor.addModule('authorship', {
        authorId: this.author
      })
    }
    if (this.keyBindings.length) {
      const keyboard = this.editor.getModule('keyboard')
      this.keyBindings.map((binding) => {
        keyboard.addHotkey({ key: binding.key, metaKey: true }, binding.method.bind(this))
      })
    }
  },
  events: {
    'set-content': function (content) {
      this.editor.setContents(content)
    },
    'set-html': function (html) {
      this.editor.setHTML(html)
    },
    'focus-editor': function () {
      this.focusEditor()
    },
    'clear-editor': function () {
      this.editor.setContents([])
    }
  },
  methods: {
    insertMath (latex) {
      var format = ' $$' + latex + '$$ '
      var range = this.editor.getLength()
      this.editor.insertText(range - 1, format, true)
      this.mathBox.enteredMath = ''
    },
    focusEditor (e) {
      if (e && e.srcElement) {
        let classList = e.srcElement.classList
        let isSegment = false
        classList.forEach((className) => {
          if (className === 'segment') {
            isSegment = true
            return
          }
        })
        if (!isSegment) return
      }
      this.editor.focus()
      this.editor.setSelection(this.editor.getLength() - 1, this.editor.getLength())
    }
  }
}
</script>
<style scoped>
  .insert-math-button {
    cursor: pointer;
  }
</style>
