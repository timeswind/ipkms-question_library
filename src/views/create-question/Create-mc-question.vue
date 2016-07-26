<style>
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
  margin:8px 4px 0 0;
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
    <mdl-button primary raised class="float-button" style="bottom: 80px" @click="questionInbox.show = true" v-bind:disabled="publishButton.disabled">
      <i class="material-icons">inbox</i> {{questionInbox.questions.length}}
    </mdl-button>
    <mdl-button primary raised class="float-button" @click="publishQuestion()" v-bind:disabled="publishButton.disabled">
      發佈
    </mdl-button>
    <p><span id="answer">x=</span></p>

    <div class="body-wrapper">
      <card>
        <div slot="content" style="padding: 16px 16px 0 16px">

          <div class="flex-column">
            <div class="flex-row">
              <div class="flex-column flex-50">
                <span class="field-title">科目</span>
                <select v-model="newQuestion.subject">
                  <option v-for="subject in subjects" v-bind:value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>
              <div class="newquestion-difficulty-box flex-column flex-50">
                <span class="field-title" style="margin-bottom:4px">難度</span>
                <span class="flex-row">
                  <i v-for="n in 5" class="material-icons" @click="newQuestion.difficulty = $index + 1" :class="{'difficulty-heighlight': newQuestion.difficulty > $index}">star_rate</i>
                </span>
              </div>
            </div>
            <div class="flex-row" style="padding-top: 25px;">
              <div class="flex-column flex-50">
                <div style="margin-right: 10px;">
                  <span class="field-title">標籤</span>
                </div>
                <div class="flex-row flex-center flex-wrap">
                  <span class="q-tag" @click="removeTag($index)" v-for="tag in newQuestion.tags" track-by="$index">{{tag}}</span>
                </div>
                <div style="position: relative;top: -12px">
                  <mdl-textfield label="輸入標籤.回車" @keyup.enter="addTag()" :value.sync="tag" style="width:200px"></mdl-textfield>
                </div>
              </div>

              <div class="flex-column flex-50">
                <span class="field-title">語言</span>
                <select v-model="newQuestion.language" v-on:change="setUserLanguage(newQuestion.language)">
                  <option v-for="language in languages" v-bind:value="language.id">
                    {{ language.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </card>
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
          <card class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 0}" @click="newQuestion.answer.mc = 0">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">A</span><div id="mc1"></div></div>
          </card>
          <card class="flex-50":class="{'hightlight-answer': newQuestion.answer.mc === 1}" @click="newQuestion.answer.mc = 1">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">B</span><div id="mc2"></div></div>
          </card>

        </div>
        <div class="flex-row">
          <card class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 2}" @click="newQuestion.answer.mc = 2">
            <div slot="content" class="flex-row flex-baseline"><span class="mc-label">C</span><div id="mc3"></div></div>
          </card>
          <card class="flex-50" :class="{'hightlight-answer': newQuestion.answer.mc === 3}" @click="newQuestion.answer.mc = 3">
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
        <div class="question" v-for="q in questionInbox.questions" track-by="_id">
          <span v-html="q.context"></span>
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
import Language from '../../modules/Languages'
import Card from '../../components/reuseable/Card'
import store from '../../vuex/store'
import { setUserLanguage } from '../../vuex/actions'
import { getUserLanguage } from '../../vuex/getters'

import 'quill/dist/quill.snow.css'

var MQ = null
// var MathQuill = window.MathQuill

var delayTimer

export default {
  ready: function () {
    MQ = window.MathQuill.getInterface(2)
    this.newQuestion.language = this.getUserLanguage

    var answerSpan = document.getElementById('answer')
    var answerMathField = MQ.MathField(answerSpan, {
      handlers: {
        edit: function () {
          var enteredMath = answerMathField.latex() // Get entered math in LaTeX format
          console.log(enteredMath)
        }
      }
    })
  },
  components: {
    Subject,
    Card
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
        this.newQuestion.rawData = JSON.stringify(this.editorPreview)
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
      languages: Language.languages,
      tag: '',
      newQuestion: {
        language: '',
        type: 'mc',
        subject: 'math',
        tags: [],
        tips: '',
        difficulty: 1,
        context: '',
        choices: ['', '', '', ''],
        answer: {
          mc: 0
        },
        rawData: ''
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
  },
  store,
  vuex: {
    actions: {
      setUserLanguage: setUserLanguage
    },
    getters: {
      getUserLanguage: getUserLanguage
    }
  }
}
</script>
