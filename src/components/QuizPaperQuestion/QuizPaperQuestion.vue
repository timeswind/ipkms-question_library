<template>
  <div class="flex-column">
    <div v-if="type === 'mc'">
      <div class="default-pending flex-row">
        <div class="question-index-label">{{index}}.</div>
        <div class="question-content" v-html="renderDelta(content)"></div>
      </div>
      <mu-row>
        <mu-col width="100" tablet="100" desktop="100" v-for="(choice, index) in choices">
          <div class="default-pending flex-row question-choice-content">
            <mu-checkbox name="correctList" style="margin-right: 16px" :nativeValue="choice._id" :value="answer" @change="checkBoxOnChange" v-if="metaData.multipleAnswer"/>
            <mu-radio name="correctList" style="margin-right: 16px" :nativeValue="choice._id" :value="answer" @change="radioOnChange" v-else/>
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
    }
  },
  data () {
    var multipleAnswer = false
    var answer = ''
    if (this.meta.length > 0) {
      this.meta.forEach((metaData) => {
        if (metaData.key === 'multiple_answer' && metaData.data === 'true') {
          multipleAnswer = true
          answer = []
        }
      })
    }
    return {
      metaData: {
        multipleAnswer: multipleAnswer
      },
      answer: answer
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.restoreAnswer()
    })
  },
  methods: {
    restoreAnswer () {
      let storeAnswer = this.allAnswers.filter((answerData) => {
        return answerData.key === this.id
      })
      if (storeAnswer && storeAnswer.length === 1) {
        this.answer = storeAnswer[0].data
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
</style>
