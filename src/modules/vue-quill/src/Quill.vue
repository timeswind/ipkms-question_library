<template>
  <div :class="className">
    <button class="c-button" type="button" @click="mathBox.show = true" v-show="!mathBox.show" style="margin: 8px">公式輸入</button>
    <div v-show="mathBox.show" class="math-input flex-column">
      <span ref="mathquillbox"></span>
      <div class="flex-row flex-baseline">
        <button class="c-button" type="button" @click="insertMath(mathBox.enteredMath)">插入公式</button>
        <button class="c-button" type="button" @click="mathBox.show = false">關閉</button>
      </div>
    </div>
    <div class="ui attached segment" ref="quill" @click.prevent="focusEditor"></div>
  </div>
</template>

<script>
const Quill = require('quill')
const MQ = window.MathQuill.getInterface(2)
import './Quill.css'
export default {
  props: {
    content: '',
    className: {
      type: String,
      default: ''
    },
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
        return ['italic', 'underline', {'list': 'ordered'}, {'list': 'bullet'}]
      }
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
      var options = {
        modules: {
          formula: true,
          toolbar: this.toolbar // Include button in toolbar
        },
        placeholder: this.placeholder,
        readOnly: false,
        theme: 'bubble'
      }
      this.editor = new Quill(this.$refs.quill, options)
      this.editor.on('text-change', function (delta, oldDelta, source) {
        self.$emit('text-change', self.editor.getContents())
      })
      this.formats.map((format) => {
        this.editor.addFormat(format.name, format.options)
      })
      if (this.content) {
        this.editor.setContents(this.content)
      }
      if (this.keyBindings.length) {
        const keyboard = this.editor.getModule('keyboard')
        this.keyBindings.map((binding) => {
          keyboard.addHotkey({ key: binding.key, metaKey: true }, binding.method.bind(this))
        })
      }
    })
  },
  methods: {
    insertMath (latex) {
      var oldDalta = this.editor.getContents()
      var oldOps = oldDalta.ops
      let oldOpsLength = oldOps.length
      console.log(oldOpsLength > 0)
      console.log(oldOps[oldOpsLength - 1].insert)
      console.log(oldOps[oldOpsLength - 1].insert.split(/\r\n|\r|\n/g).length > 0 && oldOps[oldOpsLength - 1].insert.split(/\r\n|\r|\n/g))
      if (latex.trim() !== '' && oldOps) {
        if (oldOps.length === 1 && oldOps[0].insert && oldOps[0].insert.charCodeAt(0) === 10) {
          oldDalta.ops[0] = { insert: { formula: latex } }
          oldDalta.ops.push({ insert: ' ' })
        } else if (oldOpsLength > 0 && oldOps[oldOpsLength - 1].insert) {
          var lastInsertSplit = oldOps[oldOpsLength - 1].insert.split(/\r\n|\r|\n/g)
          if (lastInsertSplit.length > 0 && lastInsertSplit[lastInsertSplit.length - 1] === '') {
            lastInsertSplit.pop()
            oldDalta.ops[oldOpsLength - 1].insert = lastInsertSplit.join('') + ' '
            oldDalta.ops.push({ insert: { formula: latex } })
            oldDalta.ops.push({ insert: ' ' })
          } else {
            oldDalta.ops.push({ insert: { formula: latex } })
            oldDalta.ops.push({ insert: ' ' })
          }
        } else {
          oldDalta.ops.push({ insert: { formula: latex } })
          oldDalta.ops.push({ insert: ' ' })
        }
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
  },
  watch: {
    content (val) {
      if (val === '' || typeof val === 'undefined') {
        this.editor.setContents([])
      }
    }
  }
}
</script>
<style scoped>
.c-button {
  cursor: pointer;
  font-size: 13px;
  margin: 8px 8px 0 0;
  padding: 2px 4px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
}
.math-input {
  padding: 8px
}
</style>
