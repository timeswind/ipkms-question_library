<template>
  <div>
    <div class="light-card">
      <div class="quiz-title-wrapper flex-row flex-baseline">
        <h2 style="padding: 0 16px">{{quiz.title}}</h2>
        <div style="margin-left: auto;margin-right: 16px">
          <i class="material-icons" style="position: relative;top:6px">timer</i>
          <span style="font-size:16px">{{quiz.duration}}分鐘</span>
        </div>
      </div>
      <div class="flex-column" v-if="mode === 'sample'" style="border-top: 1px solid #eee">
        <quiz-report :report="quizsample.report" :score="quizsample.score" :finishAt="quizsample.finishAt"/>
      </div>
      <div v-for="(question, index) in questions" :key="question._id" class="slim-border-bottom">
        <quiz-paper-question
        :index="index + 1"
        :id="question._id"
        :type="question.type"
        :content="question.content"
        :choices="question.choices"
        :randomize="question.randomize"
        :meta="question.meta"
        :role="role"
        :disabled="mode === 'sample'"
        :showCorrectiveness="mode === 'sample'"
        :answerReport="question.answerReport"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import QuizPaperQuestion from '../../components/QuizPaperQuestion/QuizPaperQuestion'
import QuizReport from '../../components/QuickquizComponents/QuizReport'

export default {
  components: {
    'quiz-paper-question': QuizPaperQuestion,
    'quiz-report': QuizReport
  },
  mounted: function () {
    this.$nextTick(function () {
      var self = this
      let quickquiz_id = this.$route.params.quickquiz_id
      if (this.$route.name === 'quiz-detail-paper') {
        this.setMode('paper').then(function () {
          if (quickquiz_id) {
            self.getQuizQuestions(quickquiz_id)
          }
        })
      } else if (this.$route.name === 'quiz-sample-paper') {
        let quizsample_id = this.$route.params.quizsample_id
        this.setMode('sample').then(function () {
          if (quickquiz_id) {
            self.getQuizQuestionsAndSample(quickquiz_id, quizsample_id)
          }
        })
      }
    })
  },
  data () {
    return {

    }
  },
  destroyed: function () {
    this.$nextTick(function () {
      this.setQuestions([])
      this.setQuiz({})
      this.setQuizsample({})
    })
  },
  methods: {
    getQuizQuestions (id) {
      let apiURL = `/api/manage-quickquiz/quickquiz?id=${id}`
      this.$http.get(apiURL).then(function (response) {
        if (response.data.success && response.data.quickquiz) {
          this.setQuiz(response.data.quickquiz)
          this.setQuestions(response.data.quickquiz.questions)
        }
      }, function (response) {
        this.$showToast('Error:' + response.data)
      })
    },
    getQuizQuestionsAndSample (quickquiz_id, quizsample_id) {
      var self = this
      let apiURL_quickquiz = `/api/manage-quickquiz/quickquiz?id=${quickquiz_id}`
      let apiURL_quizsample = `/api/quizsamples/${quizsample_id}`
      this.$http.get(apiURL_quickquiz).then(function (response) {
        if (response.data.success && response.data.quickquiz) {
          let questionDic = {}
          let _questions = response.data.quickquiz.questions
          _questions.forEach((question, index) => {
            questionDic[question._id] = index
          })
          this.setQuiz(response.data.quickquiz).then(function () {
            self.$http.get(apiURL_quizsample).then(function (another_response) {
              if (another_response.data.success && another_response.data.quizsample) {
                another_response.data.quizsample.answers.forEach((answer) => {
                  let question_index = questionDic[answer.key]
                  _questions[question_index].answerReport = answer
                })
                self.setQuestions(_questions)
                self.setQuizsample(another_response.data.quizsample)
              }
            }, function (another_response) {
              self.$showToast('Error:' + another_response.data)
            })
          })
        }
      }, function (response) {
        this.$showToast('Error:' + response.data)
      })
    },
    ...mapActions({
      setMode: 'setQuizPaperMode',
      setQuestions: 'setQuizPaperQuestions',
      setQuiz: 'setQuizDashboardQuiz',
      setQuizsample: 'setQuizPaperQuizsample'
    })
  },
  computed: mapGetters({
    role: 'getUserRole',
    mode: 'quizPaperMode',
    quiz: 'quizDashboardQuiz',
    questions: 'quizPaperQuestions',
    quizsample: 'quizPaperQuizsample'
  })
}
</script>
<style scoped>

</style>
