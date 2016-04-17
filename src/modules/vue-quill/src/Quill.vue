<style>
.my-ql-button {
  color: #000;
  cursor: pointer;
}
.ql-container {
  border-top: 1px solid #ccc
}
.quill-modal {
  padding: 4px 8px;
  border-top: 1px solid #ccc;
}

.quill-modal input {
  font-size: 14px;
  outline: 0;
  width: 100%;
  box-sizing: border-box;
}

</style>
<template>
  <div>
    <slot name="toolbar">
      <div v-el:toolbar class="ui top attached menu toolbar ql-toolbar ql-snow">
        <div class="ql-format-group">
          <a class="ql-format-button ql-bold"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-underline"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-italic"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-list"></a>
          <span class="ql-format-separator"></span>
          <a class="ql-format-button ql-bullet"></a>
          <span class="ql-format-separator"></span>
          <a class="my-ql-button" @click="mathBox.show = !mathBox.show">插入公式</a>
        </div>
      </div>
    </slot>
    <div class="quill-modal" v-show="mathBox.show">
      <button @click="insertLatex('sqrt')">根號</button>
      <button @click="insertLatex('frac')">分數</button>
      <button @click="insertLatex('pi')">pi</button>
      <input type="input" v-model="mathBox.content"/>
      <button @click="insertMath(mathBox.content)">插入</button>
      <button @click="mathBox.show = false">關閉</button>
    </div>
    <div class="ui attached segment" v-el:quill @click.prevent="focusEditor"></div>
  </div>
</template>

<script>
const Quill = require('quill')
export default {
  methods: {
    insertLatex: function (name) {
      switch (name) {
        case 'sqrt':
          this.mathBox.content += '\\sqrt{}'
          break
        case 'frac':
          this.mathBox.content += '\\frac{}{}'
          break
        case 'pi':
          this.mathBox.content += '\\pi'
          break
        default:
          this.mathBox.content += ''
      }
    },
    insertMath: function (content) {
      var format = ' $$' + content + '$$ '
      var range = this.editor.getLength()
      this.editor.insertText(range - 1, format, true)
      this.mathBox.content = ''
      // this.$dispatch('render-q-preview', this.msg)
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
        content: ''
      }
    }
  },

  ready () {
    this.editor = new Quill(this.$els.quill, {
      formats: ['bold', 'italic', 'color'],
      modules: {
        toolbar: this.$els.toolbar
      },
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

    // this.editor.insertText(0, 'Hello', 'grey')

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
      this.editor.setHtml(html)
    },
    'focus-editor': function () {
      this.focusEditor()
    },
    'clear-editor': function () {
      this.editor.setContents([])
    }
  }
}
</script>
