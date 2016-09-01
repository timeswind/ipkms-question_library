<style>
.newquestion-difficulty-box {
  padding: 10px 0
}

.newquestion-difficulty-box i {
  width: 24px;
  color: #aaa;
  cursor: pointer;
}

.difficulty-heighlight{
  color: #FFC107 !important
}

.q-tag {
  color: #E91E63;
  margin: 0 5px;
  padding: 2px 4px;
  border: 1px solid #e91e63;
  cursor: pointer;
}

#create-question .body-wrapper {
  max-width: 800px;
  margin:32px auto;
}

#question-preview-container {
  padding: 8px;
  border-top:  1px solid #ccc;
  min-height: 43px;
  box-sizing: border-box;
}

#question-preview-container p, #mc1 p, #mc2 p, #mc3 p, #mc4 p {
  margin: 0
}

.toolbar-title {
  padding: 8px;
  margin: 0
}
.mc-input-wrapper,.mc-preview-wrapper {
  display: inline-block;
  width: 100%
}
.mc-preview-wrapper .hightlight-answer .card {
  background-color: #009688;
  color: #fff
}
.mc-preview-wrapper .mc-label {
  height:52px;line-height:52px;margin-left:15px
}
</style>
<template>
  <div id="create-question">
    <sheet-pannel :sheetshow.sync="sheetshow">
      <div slot="sheet-zone">
        <div class="flex-row flex-center">
          <span>科目：</span>
          <select v-model="newQuestion.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="newquestion-difficulty-box flex-row flex-center">
          <span>難度：</span>
          <span class="flex-row">
            <i class="material-icons" @click="newQuestion.difficulty = 1" :class="{'difficulty-heighlight': newQuestion.difficulty > 0}">star_rate</i>
            <i class="material-icons" @click="newQuestion.difficulty = 2" :class="{'difficulty-heighlight': newQuestion.difficulty > 1}">star_rate</i>
            <i class="material-icons" @click="newQuestion.difficulty = 3" :class="{'difficulty-heighlight': newQuestion.difficulty > 2}">star_rate</i>
            <i class="material-icons" @click="newQuestion.difficulty = 4" :class="{'difficulty-heighlight': newQuestion.difficulty > 3}">star_rate</i>
            <i class="material-icons" @click="newQuestion.difficulty = 5" :class="{'difficulty-heighlight': newQuestion.difficulty > 4}">star_rate</i>
          </span>
        </div>

        <div class="flex-row flex-center">
          <span>類型：</span>
          <mdl-radio :checked.sync="newQuestion.type" value="mc" style="margin-right: 8px">多項選擇</mdl-radio>
          <mdl-radio :checked.sync="newQuestion.type" value="reading">閱讀題</mdl-radio>
        </div>
        <div class="flex-row" style="position:relative;top:-10px">
          <div v-show="newQuestion.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
            <span>標籤：</span>
            <span class="q-tag" @click="removeTag($index)" v-for="tag in newQuestion.tags" track-by="$index">{{tag}}</span>
          </div>
          <mdl-textfield label="輸入標籤.回車" @keyup.enter="addTag()" :value.sync="tag" style="width:200px"></mdl-textfield>
          <!-- <input @keyup.enter="addTag()" type="text" v-model="tag" placeholder="輸入標籤，回車"> -->
        </div>
        <!-- <mdl-button accent raised @click="sheetshow = false">
        隱藏
      </mdl-button> -->
    </div>
  </sheet-pannel>
  <mdl-button primary raised class="float-button" @click="publishQuestion()" v-bind:disabled="publishButton.disabled">
    發佈
  </mdl-button>
  <div class="body-wrapper">
    <h5 style="margin-left:4px">編輯題目</h5>
    <div class="flex-row">

      <div class="flex-50">
        <card>
          <div slot="out">
            <quill :content.sync="editorPreview.question"></quill>
          </div>
        </card>
      </div>
      <div class="flex-50">
        <card>
          <div slot="out">
            <p class="toolbar-title">預覽</p>
            <div id="question-preview-container"></div>
          </div>
        </card>

      </div>

    </div>
    <div v-if="newQuestion.type === 'mc'" class="mc-preview-wrapper" id="mc-preview-container">
      <p style="margin:0;text-align:center;color:#9E9E9E">點擊選項設定正確答案</p>
      <div class="flex-row">
        <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 0}" flex="true" @click="newQuestion.answer.mc = 0">
          <div slot="out"><span class="mc-label">A</span></div>
          <div slot="in"><div id="mc1"></div></div>
        </card>
        <card flex="true" class="flex-50":class="{'hightlight-answer': newQuestion.answer.mc === 1}" flex="true" @click="newQuestion.answer.mc = 1">
          <div slot="out"><span class="mc-label">B</span></div>
          <div slot="in"><div id="mc2"></div></div>
        </card>

      </div>
      <div class="flex-row">
        <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 2}" flex="true" @click="newQuestion.answer.mc = 2">
          <div slot="out"><span class="mc-label">C</span></div>
          <div slot="in"><div id="mc3"></div></div>
        </card>
        <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 3}" flex="true" @click="newQuestion.answer.mc = 3">
          <div slot="out"><span class="mc-label">D</span></div>
          <div slot="in"><div id="mc4"></div></div>
        </card>
      </div>
    </div>
    <h5 style="margin-left:4px">編輯答案</h5>

    <div v-if="newQuestion.type === 'mc'">

      <p style="margin:0;text-align:center;color:#9E9E9E">答案選項輸入</p>
      <div class="flex-row">
        <card class="flex-50"><div slot="out"><quill :content.sync="editorPreview.answer.mc[0]"></quill></div></card>
        <card class="flex-50"><div slot="out"><quill :content.sync="editorPreview.answer.mc[1]"></quill></div></card>
      </div>
      <div class="flex-row">
        <card class="flex-50"><div slot="out"><quill :content.sync="editorPreview.answer.mc[2]"></quill></div></card>
        <card class="flex-50"><div slot="out"><quill :content.sync="editorPreview.answer.mc[3]"></quill></div></card>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import renderQuill from 'quill-render'
import Subject from '../../modules/Subjects'
import sheetPannel from '../../components/reuseable/Sheet-pannel.vue'
import Card from '../../components/reuseable/Card'

import 'quill/dist/quill.snow.css'

var delayTimer

export default {
  components: {
    Subject,
    Card,
    sheetPannel
  },
  methods: {
    publishQuestion: function () {
      this.publishButton.disabled = true
      if (this.checkComplete()) {
        this.newQuestion.context = renderQuill(this.editorPreview.question.ops)
        this.newQuestion.choices[0] = renderQuill(this.editorPreview.answer.mc[0].ops)
        this.newQuestion.choices[1] = renderQuill(this.editorPreview.answer.mc[1].ops)
        this.newQuestion.choices[2] = renderQuill(this.editorPreview.answer.mc[2].ops)
        this.newQuestion.choices[3] = renderQuill(this.editorPreview.answer.mc[3].ops)

        this.$http.post('/api/manage-question/questions', this.newQuestion).then(function (response) {
          this.$showToast('發佈成功')
          this.publishButton.disabled = false
          this.newQuestion.context = ''
          this.newQuestion.choices = ['', '', '', '']
          this.newQuestion.answer = {
            mc: 1,
            long: ''
          }
          this.editorPreview = {
            question: { ops: [] },
            answer: {
              mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ],
              long: { ops: [] }
            }
          }
          this.$broadcast('clear-editor')
        }, function (response) {
          this.$showToast('發佈失敗')
          this.publishButton.disabled = false
          console.log(response)
        })
      } else {
        this.publishButton.disabled = false
        this.$showToast('信息不完整')
      }
    },
    checkComplete: function () {
      let contentComplete = this.editorPreview.question.ops.length !== 0
      let answerComplete
      if (this.newQuestion.type === 'mc') {
        answerComplete = this.editorPreview.answer.mc[0].ops.length !== 0 && this.editorPreview.answer.mc[1].ops.length !== 0 && this.editorPreview.answer.mc[2].ops.length !== 0 && this.editorPreview.answer.mc[3].ops.length !== 0
      } else if (this.newQuestion.type === 'long') {
        answerComplete = this.editorPreview.answer.long.ops.length !== 0
      }
      return (contentComplete && answerComplete)
    },
    addTag: function () {
      if (this.tag.trim() !== '') {
        this.newQuestion.tags.push(this.tag)
        this.tag = ''
      } else {
        this.tag = ''
      }
    },
    removeTag: function (index) {
      this.newQuestion.tags.splice(index, 1)
    },
    showToast: function (message) {
      store.dispatch('showToast', message)
    },
    renderQuestionPreview: function () {
      window.document.getElementById('question-preview-container').innerHTML = renderQuill(this.editorPreview.question.ops)
      setTimeout(function renderQuestionPreview () {
        window.renderMathInElement(
          document.getElementById('question-preview-container'),
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }, 0)
    },
    renderMcPreview: function () {
      window.document.getElementById('mc1').innerHTML = renderQuill(this.editorPreview.answer.mc[0].ops)
      window.document.getElementById('mc2').innerHTML = renderQuill(this.editorPreview.answer.mc[1].ops)
      window.document.getElementById('mc3').innerHTML = renderQuill(this.editorPreview.answer.mc[2].ops)
      window.document.getElementById('mc4').innerHTML = renderQuill(this.editorPreview.answer.mc[3].ops)

      setTimeout(function renderMcPreview () {
        window.renderMathInElement(
          document.getElementById('mc-preview-container'),
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }, 0)
    }
  },
  data () {
    return {
      publishButton: {
        disabled: false
      },
      sheetshow: true,
      subjects: Subject.subjects,
      tag: '',
      newQuestion: {
        type: 'mc',
        subject: 'math',
        tags: [],
        tips: '',
        difficulty: 1,
        context: '',
        choices: ['', '', '', ''],
        answer: {
          mc: 0,
          long: ''
        }
      },
      editorPreview: {
        question: { ops: [] },
        answer: {
          mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ],
          long: { ops: [] }
        }
      }
    }
  },
  watch: {
    'editorPreview.question.ops': function () {
      var v = this
      clearTimeout(delayTimer)
      delayTimer = setTimeout(function () {
        v.renderQuestionPreview()
      }, 400)
    },
    'editorPreview.answer.mc': function () {
      var v = this
      clearTimeout(delayTimer)
      delayTimer = setTimeout(function () {
        v.renderMcPreview()
      }, 500)
    }
  }
}
</script>
