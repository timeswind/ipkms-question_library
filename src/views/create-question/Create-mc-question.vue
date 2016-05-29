<style>
#create-mc-question .newquestion-difficulty-box {
  padding: 10px 0
}

#create-mc-question .newquestion-difficulty-box i {
  width: 24px;
  color: #aaa;
  cursor: pointer;
}

#create-mc-question .difficulty-heighlight{
  color: #FFC107 !important
}

#create-mc-question .q-tag {
  color: #E91E63;
  margin: 0 5px;
  padding: 2px 4px;
  border: 1px solid #e91e63;
  cursor: pointer;
}

#create-mc-question .body-wrapper {
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

#question-preview-container ul, #mc1 ul, #mc2 ul, #mc3 ul, #mc4 ul {
  margin: 0
}

#create-mc-question .toolbar-title {
  padding: 8px;
  margin: 0
}
#create-mc-question .mc-input-wrapper,#create-mc-question .mc-preview-wrapper {
  display: inline-block;
  width: 100%
}

#create-mc-question .mc-preview-wrapper .card {
  cursor: pointer;
}

#create-mc-question .mc-preview-wrapper .hightlight-answer .card {
  background-color: #009688;
  color: #fff
}
#create-mc-question .mc-preview-wrapper .mc-label {
  margin-right: 16px
}
#create-mc-question .questions_inbox {
  position: fixed;
  right: -360px;
  top: 55px;
  background: #fff;
  width: 360px;
  box-shadow: 0 0 12px #aaa;
  height: 100%;
  transition: right 0.2s;
}

#create-mc-question .questions_inbox.show {
  right: 0;
}

#create-mc-question .questions_inbox .question {
  padding: 8px 16px;
  border-bottom: 1px solid #eee
}

#create-mc-question .mc-preview-wrapper .card {
  padding: 16px
}

</style>
<template>
  <div id="create-mc-question">
    <sheet-pannel :sheetshow="true">
      <div slot="sheet-zone">
        <div class="flex-column">
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
              <i v-for="1 in 5" class="material-icons" @click="newQuestion.difficulty = $index + 1" :class="{'difficulty-heighlight': newQuestion.difficulty > $index}">star_rate</i>
            </span>
          </div>
          <div class="flex-column" style="position:relative;top:-16px">
            <div v-show="newQuestion.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
              <span>標籤：</span>
              <span class="q-tag" @click="removeTag($index)" v-for="tag in newQuestion.tags" track-by="$index">{{tag}}</span>
            </div>
            <mdl-textfield label="輸入標籤.回車" @keyup.enter="addTag()" :value.sync="tag" style="width:200px"></mdl-textfield>
          </div>

        </div>


      </div>
    </sheet-pannel>
    <mdl-button primary raised class="float-button" style="bottom: 80px" @click="questionInbox.show = true" v-bind:disabled="publishButton.disabled">
      <i class="material-icons">inbox</i> {{questionInbox.questions.length}}
    </mdl-button>
    <mdl-button primary raised class="float-button" @click="publishQuestion()" v-bind:disabled="publishButton.disabled">
      發佈
    </mdl-button>
    <div class="body-wrapper">
      <h5 style="margin-left:4px">編輯題目</h5>
      <div class="flex-row">

        <div class="flex-50">
          <card>
            <div slot="content">
              <quill :content.sync="editorPreview.question"></quill>
            </div>
          </card>
        </div>

        <div class="flex-50">
          <card>
            <div slot="content">
              <p class="toolbar-title">預覽</p>
              <div id="question-preview-container"></div>
            </div>
          </card>
        </div>

      </div>
      <div class="mc-preview-wrapper" id="mc-preview-container">
        <p style="margin:0;text-align:center;color:#9E9E9E">點擊選項設定正確答案</p>
        <div class="flex-row">
          <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 0}" flex="true" @click="newQuestion.answer.mc = 0">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">A</span><div id="mc1"></div></div>
          </card>
          <card flex="true" class="flex-50":class="{'hightlight-answer': newQuestion.answer.mc === 1}" flex="true" @click="newQuestion.answer.mc = 1">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">B</span><div id="mc2"></div></div>
          </card>

        </div>
        <div class="flex-row">
          <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 2}" flex="true" @click="newQuestion.answer.mc = 2">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">C</span><div id="mc3"></div></div>
          </card>
          <card flex="true" class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 3}" flex="true" @click="newQuestion.answer.mc = 3">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">D</span><div id="mc4"></div></div>
          </card>
        </div>
      </div>
      <h5 style="margin-left:4px">編輯答案</h5>

      <div>

        <p style="margin:0;text-align:center;color:#9E9E9E">答案選項輸入</p>
        <div class="flex-row">
          <card class="flex-50"><div slot="content"><quill :content.sync="editorPreview.answer.mc[0]"></quill></div></card>
          <card class="flex-50"><div slot="content"><quill :content.sync="editorPreview.answer.mc[1]"></quill></div></card>
        </div>
        <div class="flex-row">
          <card class="flex-50"><div slot="content"><quill :content.sync="editorPreview.answer.mc[2]"></quill></div></card>
          <card class="flex-50"><div slot="content"><quill :content.sync="editorPreview.answer.mc[3]"></quill></div></card>
        </div>
      </div>
    </div>

    <div class="questions_inbox flex-column" :class="{'show': questionInbox.show}">
      <div class="flex-row" style="margin-top: 26px;padding-left: 16px;cursor: pointer;padding-bottom: 15px;width: 100%;border-bottom: 1px solid #E0E0E0;">
        <i class="material-icons" @click="questionInbox.show = false">close</i>
        <span style="font-size: 20px;padding-top: 2px;padding-left: 16px;">創建題集記錄</span>
      </div>

      <div class="flex-column flex-center" style="margin: 8px 0;" id="getLatestQuestionsButton">
        <mdl-button primary raised @click="getLatestQuestionsCreatedByMe()">獲取我最近創建的題目</mdl-button>
      </div>

      <div class="flex-column" style="overflow-y: auto;margin-bottom:60px; flex: 1">
        <div class="question" v-for="q in questionInbox.questions" indexBy="_id">
          <span>{{{q.context}}}</span>
          <div class="flex-row">
            <span style="color: #9E9E9E">{{q._id | timestamp}}</span>
            <span class="flex-row flex-center" style="color:#FFC107;margin-left:auto">{{q.difficulty}}<i class="material-icons" style="font-size: 18px">star</i></span>
          </div>
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
// var MathQuill = window.MathQuill

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
            mc: 1
          }
          this.editorPreview = {
            question: { ops: [] },
            answer: {
              mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ]
            }
          }
          this.$broadcast('clear-editor')
          this.renderQuestionPreview('clear')
          this.renderMcPreview('clear')
          this.questionInbox.questions.push(response.data)
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
      let answerComplete = this.editorPreview.answer.mc[0].ops.length !== 0 && this.editorPreview.answer.mc[1].ops.length !== 0 && this.editorPreview.answer.mc[2].ops.length !== 0 && this.editorPreview.answer.mc[3].ops.length !== 0

      return (contentComplete && answerComplete)
    },
    addTag: function () {
      if (this.tag.trim() !== '') {
        if (this.newQuestion.tags.indexOf(this.tag) === -1) {
          this.newQuestion.tags.push(this.tag)
          this.tag = ''
        } else {
          this.tag = ''
        }
      }
    },
    removeTag: function (index) {
      this.newQuestion.tags.splice(index, 1)
    },
    renderQuestionPreview: function (option) {
      if (option === 'clear') {
        window.document.getElementById('question-preview-container').innerHTML = '<p></p>'
      } else {
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
      }
    },
    renderMcPreview: function (option) {
      if (option === 'clear') {
        window.document.getElementById('mc1').innerHTML = '<p></p>'
        window.document.getElementById('mc2').innerHTML = '<p></p>'
        window.document.getElementById('mc3').innerHTML = '<p></p>'
        window.document.getElementById('mc4').innerHTML = '<p></p>'
      } else {
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
    getLatestQuestionsCreatedByMe: function () {
      this.$http.get('/api/manage-question/mine').then(function (response) {
        document.getElementById('getLatestQuestionsButton').style.display = 'none'
        this.questionInbox.questions = response.data
      })
    }
  },
  data () {
    return {
      publishButton: {
        disabled: false
      },
      questionInbox: {
        questions: [],
        show: false
      },
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
          mc: 0
        }
      },
      editorPreview: {
        question: { ops: [] },
        answer: {
          mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ]
        }
      }
    }
  },
  filters: {
    'timestamp': function (input) {
      return this.$options.filters.calendar(new Date(parseInt(input.toString().substring(0, 8), 16) * 1000), '')
    }
  },
  watch: {
    'editorPreview.question.ops': function () {
      var self = this
      clearTimeout(delayTimer)
      delayTimer = setTimeout(function () {
        self.renderQuestionPreview()
      }, 500)
    },
    'editorPreview.answer.mc': function () {
      var self = this
      clearTimeout(delayTimer)
      delayTimer = setTimeout(function () {
        self.renderMcPreview()
      }, 500)
    }
  }
}
</script>
