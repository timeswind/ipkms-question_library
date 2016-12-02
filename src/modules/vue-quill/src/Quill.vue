<template>
  <div>
    <button class="c-button" type="button" @click.native="mathBox.show = true" v-show="!mathBox.show" style="margin: 8px">公式輸入</button>
    <div v-show="mathBox.show" class="math-input flex-column">
      <span ref="statistic"></span>
      <div class="flex-row flex-baseline">
        <button class="c-button"  type="button" @click.native="insertMath(mathBox.enteredMath)">插入公式</button>
        <button class="c-button"  type="button" @click.native="mathBox.show = false">關閉</button>
        <!-- <a style="font-size: 12px" href="https://www.udacity.com/wiki/ma006/mathquill">快捷操作</a> -->
      </div>
    </div>
    <div class="ui attached segment" ref="quill" @click.prevent="focusEditor"></div>
  </div>
</template>

<script>
const Quill = require('quill')
const MQ = window.MathQuill.getInterface(2)
export default {
  props: {
    content: {},
    placeholder: {
      type: String,
      default: ''
    },
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
    toolbar: {
      type: Array,
      default () {
        return ['bold', 'italic', 'underline', 'strike']
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
  mounted: function () {
    this.$nextTick(function () {
      var self = this
      var mathinput = this.$refs.mathquillbox
      var MathField = MQ.MathField(mathinput, {
        handlers: {
          edit: function () {
            self.mathBox.enteredMath = MathField.latex() // Get entered math in LaTeX format
          }
        }
      })

      this.MathField = MathField

      // console.log(MathField)
      // var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

      var options = {
        modules: {
          formula: true,
          toolbar: this.toolbar // Include button in toolbar
        },
        placeholder: this.placeholder,
        readOnly: false,
        theme: 'snow'
      }
      this.editor = new Quill(this.$refs.quill, options)
      // this.editor = new Quill(this.$refs.quill, {
      //   modules: { toolbar: this.$refs.toolbar, 'link-tooltip': true },
      //   theme: 'snow'
      // })
      this.formats.map((format) => {
        this.editor.addFormat(format.name, format.options)
      })
      if (this.output !== 'delta') {
        this.editor.setHTML(this.content)
      } else {
        this.editor.setContents(this.content)
      }
      this.editor.on('text-change', (delta, source) => {
        this.$emit('text-change', this.editor, delta, source)
        this.content = this.output !== 'delta' ? this.editor.getHTML() : this.editor.getContents()
      })
      this.editor.on('selection-change', (range) => {
        this.$emit('selection-change', this.editor, range)
      })
      if (this.keyBindings.length) {
        const keyboard = this.editor.getModule('keyboard')
        this.keyBindings.map((binding) => {
          keyboard.addHotkey({ key: binding.key, metaKey: true }, binding.method.bind(this))
        })
      }
    })
  },
  events: {
    'set-content': function (content) {
      this.editor.setContents(content)
    },
    'set-html': function (html) {
      this.editor.pasteHTML(html)
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
      if (latex.trim() !== '') {
        var oldDalta = this.editor.getContents()
        oldDalta.ops.push({ insert: { formula: latex } })
        this.editor.setContents(oldDalta)
        this.MathField.latex('')
        this.mathBox.enteredMath = ''
      }
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
.c-button {
  cursor: pointer;
  margin: 8px 8px 0 0;
  padding: 8px;
  background-color: #eee;
  border: 1px solid #ddd
}
.math-input {
  padding: 8px
}
</style>
