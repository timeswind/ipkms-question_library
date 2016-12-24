<template>
  <div class="flex-column">
    <div>
      <div class="width-wrapper">
        <div>
          <div class="quiz-title-wrapper light-card flex-row flex-baseline">
            <h2 style="padding: 0 16px">{{quiz.title}}</h2>
            <div style="margin-left: auto;margin-right: 16px">
              <i class="material-icons" style="position: relative;top:6px">timer</i>
              <span style="font-size:16px">{{quiz.duration}}分鐘</span>
            </div>
          </div>
        </div>
        <div class="light-card">
          <div v-for="(question, index) in quiz.questions" :key="question._id" class="slim-border-bottom">
            <quiz-paper-question :index="index + 1" :id="question._id" :type="question.type" :content="question.content" :choices="question.choices" :randomize="question.randomize" :meta="question.meta"/>
          </div>
        </div>
        <div class="flex-row actions-wrapper">
          <mu-raised-button label="上交" primary @click="handIn" style="margin-left: auto"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import io from 'socket.io-client'
import QuizPaperQuestion from '../../components/QuizPaperQuestion/QuizPaperQuestion'
import { mapActions, mapGetters } from 'vuex'
import scoreQuiz from '../../modules/score-quiz'

export default {
  components: {
    'quiz-paper-question': QuizPaperQuestion
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getQuiz()
    })
  },
  destroyed: function () {
    this.$nextTick(function () {
      this.socket.io.disconnect()
      // console.log('emit socket disconnect')
    })
  },
  data () {
    return {
      socket: null,
      quiz: {},
      seeds: null
    }
  },
  methods: {
    handIn () {
      console.log(this.allAnswers)
      let data = {
        id: this.$route.params.quiz_id,
        answers: this.allAnswers
      }
      this.$http.post(`/api/manage-quickquiz/quickquiz`, data).then(function (response) {
        console.log(response.data)
      }, function (response) {
        console.log(response)
      })
    },
    getQuiz () {
      if (this.$route.params.quiz_id) {
        let quiz_id = this.$route.params.quiz_id
        this.$http.get(`/api/manage-quickquiz/quickquiz?id=${quiz_id}`).then(function (response) {
          if (response.data.success && response.data.quickquiz) {
            this.quiz = response.data.quickquiz
            this.setQuizId(response.data.quickquiz._id)
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
      setQuizId: 'setQuizId'
    })
  },
  computed: {
    throttleEmitReport: function (report) {
      var self = this
      return _.throttle(function (report) {
        console.log(report)
        self.socket.emit('student answer update', report)
      }, 1000)
    },
    ...mapGetters({
      subjects: 'getSubjects',
      allAnswers: 'quizAnswers'
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
  margin-top: 16px;
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
