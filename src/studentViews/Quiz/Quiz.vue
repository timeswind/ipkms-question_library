<template>
  <div class="flex-column">
    <div>
      <div class="width-wrapper">
        <div v-show="quiz.ended" class="light-card default-pending" style="border-left: 4px solid #ff5722;font-size: 16px;margin-top: 16px; margin-bottom: 16px; font-weight: bold">
          該小測已經結束
        </div>
        <div>
          <div class="quiz-title-wrapper light-card flex-row flex-baseline">
            <h2 style="padding: 0 16px">{{quiz.title}}</h2>
            <div style="margin-left: auto;margin-right: 16px">
              <i class="material-icons" style="position: relative;top:6px">timer</i>
              <span style="font-size:16px">{{quiz.duration}}分鐘</span>
            </div>
          </div>
        </div>

        <div class="flex-column light-card" v-if="handin" style="margin-bottom: 16px">
          <quiz-report :report="quizsample.report" :score="quizsample.score" :finishAt="quizsample.finishAt"/>
        </div>

        <div class="light-card">
          <div class="flex-column default-pending slim-border-bottom" v-if="handin">
            <div class="flex-row">
              <div class="flex-row flex-center" style="margin-right: 16px">
                <mu-icon value="check_circle" color="#009688" style="margin-right: 4px"/><span>正確選項</span>
              </div>
              <div class="flex-row flex-center">
                <mu-icon value="cancel" color="#f44336" style="margin-right: 4px"/><span>錯誤選項</span>
              </div>
            </div>
          </div>
          <div v-for="(question, index) in quiz.questions" :key="question._id" class="slim-border-bottom">
            <quiz-paper-question
            :index="index + 1"
            :id="question._id"
            :type="question.type"
            :content="question.content"
            :choices="question.choices"
            :randomize="question.randomize"
            :meta="question.meta"
            :role="role"
            :showCorrectAnswer="handin"
            :showCorrectiveness="handin"
            :disabled="handin || quiz.ended"/>
          </div>
        </div>
        <div class="flex-row actions-wrapper">
          <mu-raised-button label="上交" primary @click="handIn" style="margin-left: auto;margin-right: 8px" v-show="!quiz.ended && !handin"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import io from 'socket.io-client'
import QuizPaperQuestion from '../../components/QuizPaperQuestion/QuizPaperQuestion'
import QuizReport from '../../components/QuickquizComponents/QuizReport'
import { mapActions, mapGetters } from 'vuex'
import scoreQuiz from '../../modules/score-quiz'

export default {
  components: {
    'quiz-paper-question': QuizPaperQuestion,
    'quiz-report': QuizReport
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getQuiz()
    })
  },
  destroyed: function () {
    this.$nextTick(function () {
      if (this.socket) {
        this.setQuiz({})
        this.setQuizSample({})
        this.setQuizAnswers([])
        this.socket.io.disconnect()
      }
    })
  },
  data () {
    return {
      socket: null,
      seeds: null,
      handin: false
    }
  },
  methods: {
    handIn () {
      var self = this
      console.log(this.allAnswers)
      let data = {
        id: this.$route.params.quiz_id,
        answers: this.allAnswers
      }
      this.$http.post(`/api/manage-quickquiz/student/handin`, data).then(function (response) {
        if (response.data.success && response.data.quizsample) {
          self.socket.emit('student handin', response.data.quizsample)
          this.setQuizAnswers(response.data.quizsample.answers).then(function () {
            self.handin = true
            self.setQuizSample(response.data.quizsample)
          })
        }
      }, function (response) {
        console.log(response)
      })
    },
    getQuiz () {
      if (this.$route.params.quiz_id) {
        let quiz_id = this.$route.params.quiz_id
        this.$http.get(`/api/manage-quickquiz/quickquiz?id=${quiz_id}`).then(function (response) {
          if (response.data.success && response.data.quickquiz) {
            if (response.data.quickquiz.endAt && new Date() > new Date(response.data.quickquiz.endAt)) {
              response.data.quickquiz.ended = true
            } else {
              response.data.quickquiz.ended = false
            }
            if (response.data.handin) {
              this.handin = true
              if (response.data.quizsample && response.data.quizsample.answers) {
                this.setQuizSample(response.data.quizsample)
                this.setQuizAnswers(response.data.quizsample.answers)
              } else {
                console.error('exception')
              }
            }
            this.setQuiz(response.data.quickquiz)
            this.listenForSocket()
          } else {
            this.$showToast('Error Occur')
          }
        }, function (response) {
          console.log(response)
        })
      }
    },
    listenForSocket: function () {
      var self = this
      if (this.socket === null) {
        this.socket = io.connect('/quickquiz', {
          'reconnection': true,
          'reconnectionDelay': 500,
          'reconnectionAttempts': 10
        })
        this.socket.on('connect', function () {
          self.socket.emit('authenticate', { token: window.sessionStorage.token, quickquiz_id: self.$route.params.quickquiz_id }) // send the jwt
        })
        this.socket.on('joined', function () {
          self.$showToast('服務連接成功')
        })
        this.socket.on('seeds', function (data) {
          let parsedData = JSON.parse(data)
          console.log(parsedData)
          var mapQuestions = {}
          parsedData.forEach((question) => {
            if (question && question._id) {
              mapQuestions[question._id] = question
            } else {
              mapQuestions[question] = null
            }
          })
          self.seeds = mapQuestions
        })
        this.socket.on('reconnecting', function () {
          console.log('reconnecting')
        })
        this.socket.on('authenticated', function () {
          self.socket.emit('user join', { quickquizId: self.$route.params.quiz_id })
          console.log('socket auth success' + new Date())
        })
        this.socket.on('unauthorized', function (error) {
          if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token') {
            this.$showToast('登入憑證過期，重新驗證身份')
            this.showLoginModal()
          } else {
            console.log('unauthorized: ' + JSON.stringify(error.data))
            this.$showToast('Error:' + error.data)
          }
        })
      }
    },
    ...mapActions({
      setQuiz: 'setQuiz',
      setQuizSample: 'setQuizSample',
      setQuizAnswers: 'setQuizAnswers'
    })
  },
  computed: {
    throttleEmitReport: function (report) {
      var self = this
      return _.throttle(function (report) {
        self.socket.emit('student answer update', report)
      }, 1000)
    },
    ...mapGetters({
      role: 'getUserRole',
      subjects: 'getSubjects',
      allAnswers: 'quizAnswers',
      quiz: 'quizInfo',
      quizsample: 'quizSample'
    })
  },
  watch: {
    allAnswers (value) {
      var self = this
      if (this.seeds) {
        scoreQuiz(this.seeds, value, function (err, report) {
          if (err) {
            console.log(err)
          } else {
            self.throttleEmitReport(report)
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.quiz-title-wrapper {
  margin-bottom: 16px
}
.width-wrapper {
  max-width: 800px;
  margin:0 auto;
}
.actions-wrapper {
  margin: 16px 0
}
</style>
