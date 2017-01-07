<template>
  <div class="flex-column">
    <div v-if="role === 'teacher'" class="teacher-toolbar">
      <mu-flat-button :label="correctAnswerShow ? '隱藏答案' : '顯示答案'" style="background-color: #eee" @click="toggleCorrectAnswerShow()"/>
    </div>
    <div v-if="type === 'mc'">
      <div class="default-pending flex-row">
        <div class="question-index-label">{{index}}.</div>
        <div class="question-content" v-html="renderDelta(content)"></div>
        <div v-if="showCorrectiveness" :class="correct ? 'question-correct' : 'question-incorrect'">{{correct ? '回答正確' : '回答錯誤'}}</div>
      </div>
      <mu-row>
        <mu-col width="100" tablet="100" desktop="100" v-for="(choice, index) in choices">
          <div class="default-pending flex-row question-choice-content">
            <div v-if="correctAnswerShow" class="correct-answer-mc">
              <mu-icon value="check_circle" color="#009688" v-if="choice.correct"/>
              <mu-icon value="cancel" color="#f44336" v-else/>
            </div>
            <mu-checkbox name="correctList" style="margin-right: 16px" :nativeValue="choice._id" :value="answer" @change="checkBoxOnChange" v-if="metaData.multipleAnswer" :disabled="showCorrectAnswer || disabled"/>
            <mu-radio name="correctList" style="margin-right: 16px" :nativeValue="choice._id" :value="answer" @change="radioOnChange" v-else :disabled="showCorrectAnswer || disabled"/>
            <div v-html="renderDelta(choice.content)"></div>
          </div>
        </mu-col>
      </mu-row>
    </div>
    <div v-else>
      <div>
        Question type not support
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import deltaRender from '../../modules/delta-render'

export default {
  name: 'quiz-paper-question',
  props: {
    index: {
      type: Number,
      default: 0
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    choices: {
      type: Array,
      default: []
    },
    randomize: {
      type: Boolean,
      default: false
    },
    meta: {
      type: Array,
      default: []
    },
    role: {
      type: String,
      default: ''
    },
    showCorrectiveness: {
      type: Boolean,
      default: false
    },
    showCorrectAnswer: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    answerReport: {
      type: Object,
      default: function () {
        return {}
      }
    },
    answerCorrect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var multipleAnswer = false
    var correctAnswerShow = false
    var answer = ''
    if (this.meta.length > 0) {
      this.meta.forEach((metaData) => {
        if (metaData.key === 'multiple_answer' && metaData.data === 'true') {
          multipleAnswer = true
          answer = []
        }
      })
    }
    if (this.showCorrectAnswer) {
      correctAnswerShow = true
    }
    return {
      metaData: {
        multipleAnswer: multipleAnswer
      },
      answer: answer,
      correct: null,
      correctAnswerShow: correctAnswerShow
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.restoreAnswer()
    })
  },
  methods: {
    toggleCorrectAnswerShow () {
      this.correctAnswerShow = !this.correctAnswerShow
    },
    restoreAnswer () {
      if (Object.keys(this.answerReport).length === 0) {
        let storeAnswer = this.allAnswers.filter((answerData) => {
          return answerData.key === this.id
        })
        if (storeAnswer && storeAnswer.length === 1) {
          this.answer = storeAnswer[0].data
          if ('correct' in storeAnswer[0] && storeAnswer[0].correct === true) {
            this.correct = true
          } else if ('correct' in storeAnswer[0] && storeAnswer[0].correct === false) {
            this.correct = false
          }
        }
      } else {
        // this.correctAnswerShow = true
        if (this.answerReport.correct === true) {
          this.correct = true
        } else {
          this.correct = false
        }
        if (this.answerReport.data) {
          this.answer = this.answerReport.data
        }
      }
    },
    renderDelta (delta) {
      return deltaRender(delta)
    },
    checkBoxOnChange (value) {
      this.answer = value
      let payload = {
        key: this.id,
        answer: value
      }
      this.updateAnswer(payload)
    },
    radioOnChange (value) {
      this.answer = value
      let payload = {
        key: this.id,
        answer: value
      }
      this.updateAnswer(payload)
    },
    ...mapActions({
      updateAnswer: 'updateQuizAnswer'
    })
  },
  computed: {
    allAnswers () {
      return this.$store.getters.quizAnswers
    }
  },
  watch: {
    showCorrectAnswer: function (val) {
      this.restoreAnswer()
      if (val === true) {
        this.correctAnswerShow = true
      } else {
        this.correctAnswerShow = false
      }
    },
    disabled: function (val) {
      if (val === true) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  }
}
</script>
<style scoped>
.question-index-label {
  padding-right: 16px;
  font-size: 15px;
  font-weight: bold;
}
.question-content, .question-choice-content {
  font-size: 17px
}
.question-correct {
  margin-left: auto;
  background: #009688;
  color: #fff;
  padding: 2px 8px;
  border-radius: 3px;
}
.question-incorrect {
  margin-left: auto;
  background: #F44336;
  color: #fff;
  padding: 2px 8px;
  border-radius: 3px;
}
.teacher-toolbar {
  padding: 16px 16px 0 16px
}
.correct-answer-mc {
  padding-right: 8px
}
</style>
