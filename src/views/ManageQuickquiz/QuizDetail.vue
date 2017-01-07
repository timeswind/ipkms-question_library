<template>
  <div id="quiz-detail">
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mu-raised-button label="返回" icon="keyboard_arrow_left" primary @click="$goBack()" />
        <mu-raised-button v-if="quickquiz.finished" style="margin-left:16px" icon="redo" label="再測一次" />
        <mu-raised-button v-if="!quickquiz.finished" label="結束小測" icon="gavel" style="margin-left:16px" raised accent @click="endQuiz()" />
        <mu-raised-button label="查看试卷" icon="description" style="margin-left:16px" raised primary @click="routeToQuizPaper()"/>
        <mu-raised-button label="刪除小測" icon="delete" v-if="quickquiz.finished" raised accent @click="deleteQuiz()" style="margin-left: 16px" />
      </div>
      <div class="flex-column second-wrapper light-card">
        <div class="flex-column" style="padding:16px">
          <div class="flex-row flex-baseline">
            <h2 class="quiz-title">{{quickquiz.title}}</h2>
            <span class="quiz-finished">{{quickquiz.finished ? '已結束' : '進行中'}}</span>
            <span class="flex-row flex-center quiz-questions-count"><i class="material-icons">description</i><span>{{quickquiz.questions && quickquiz.questions.length}}題</span></span>
            <span class="flex-row flex-center quiz-time"><i class="material-icons">timer</i><span>{{quickquiz.duration}}分鐘</span></span>
          </div>
        </div>

        <div class="flex-row flex-center" style="border-top:1px solid #eee;">
          <span class="flex-column flex-50" style="padding: 16px;border-right:1px solid #eee;">
            <span class="field-title">開始於</span>
            <span class="field-content">{{quickquiz.startAt | date('YYYY[年]M[月]DD[日] H:mm')}}</span>
          </span>
          <span class="flex-column flex-50" style="padding: 16px;border-right:1px solid #eee;" v-if="quickquiz.finished">
            <span class="field-title">結束於</span>
            <span class="field-content">{{quickquiz.endAt | date('YYYY[年]M[月]DD[日] H:mm')}}</span>
          </span>
        </div>
        <div v-show="realtimeChartShow" style="padding: 16px;border-top: 1px solid #eee">
          <canvas width="400px" height="200" ref="realtimeChart"></canvas>
        </div>
        <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">學生 {{Object.keys(students).length}}名</p>
        <mu-row gutter>
          <mu-col width="100" tablet="50" desktop="33" class="student" v-for="(student, key, index) in students" v-bind:key="key" @click.native="handleStudentOnClick(student)">
            <div class="flex-row flex-center">
              <div class="student-status online" v-show="student.online"></div>
              <span class="student-name">{{student.name}}</span>
              <span class="student-finished" v-if="'finished' in student">{{student.finished ? '已完成' : '未完成'}}</span>
            </div>
            <quiz-progress-bar :correct="student.correct" :incorrect="student.incorrect" :unstarted="student.unstarted" v-if="!student.finished"/>
            <span v-else>評分: {{student.score}}</span>
          </mu-col>
        </mu-row>
        <div class="flex-column" v-show="quickquiz.finished">
          <p style="padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa;border-top:1px solid #eee;">數據 統計</p>
          <div class="flex-row flex-center" style="margin-top: 16px">
            <span style="margin: 16px 16px 16px 32px; font-size: 26px;">學生表現</span>
            <mu-flat-button primary @click="drawSPChart('time')">
              <i class="material-icons">swap_vert</i>
              <span>時間</span>
            </mu-flat-button>
            <mu-flat-button primary style="margin-left:16px" @click="drawSPChart('correct')">
              <i class="material-icons">swap_vert</i>
              <span>正確題數</span>
            </mu-flat-button>
          </div>
          <canvas ref="spChart"></canvas>
          <div class="flex-row flex-center" style="margin-top:32px;border-top:1px solid #ddd;padding-top:16px">
            <span style="margin: 16px 16px 16px 32px; font-size: 26px;">題目數據</span>
            <mu-flat-button primary @click="drawQAChart('correct')">
              <i class="material-icons">swap_vert</i>
              <span>正確數量</span>
            </mu-flat-button>
          </div>
          <canvas width="400px" height="200" ref="qaChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Chart from 'chart.js'
import io from 'socket.io-client'
import { mapGetters, mapActions } from 'vuex'
import QuizProgressBar from '../../components/QuizProgressBar/QuizProgressBar'
// import scoreQuiz from '../../modules/score-quiz'

var qaChart = null
var spChart = null
export default {
  components: {
    'quiz-progress-bar': QuizProgressBar
  },
  data () {
    return {
      socket: null,
      reconnecting: false,
      realtimeChart: null,
      realtimeChartDic: {},
      charts: {
        sp: {
          time: 0,
          correct: 0
        },
        qa: {
          correct: 0,
          wrong: 0
        }
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let quickquiz_id = this.$route.params.quickquiz_id
      this.getQuickquizDetail(quickquiz_id)
    })
  },
  destroyed: function () {
    this.$nextTick(function () {
      if (this.socket) {
        this.socket.io.disconnect()
      }
    })
  },
  methods: {
    getQuickquizDetail: function (id) {
      console.log('getQuickquizDetail')
      let apiURL = `/api/manage-quickquiz/teacher/quickquiz/${id}`
      this.$http.get(apiURL).then(function (response) {
        if (response.data.success && response.data.quickquiz) {
          if (response.data.quizsamples && response.data.quizsamples.length > 0) {
            this.analysisStudentsSamples(response.data.quizsamples)
            this.setQuizDashboardQuizsamples(response.data.quizsamples)
          }
          if (response.data.quickquiz.endAt) {
            response.data.quickquiz.finished = true
          } else {
            response.data.quickquiz.finished = false
            this.listenForSocket()
          }
          this.setQuizDashboardQuiz(response.data.quickquiz)
        }
      }, function (response) {
        this.$showToast('Error:' + response.data)
      })
    },
    // mountJoinedStudents (students) {
    //   let self = this
    //   _.forEach(students, function (student, index) {
    //     self.updateQuizDashboardStudent({id: student._id, student: student})
    //   })
    // },
    endQuiz: function () {
      if (!this.quickquiz.finished) {
        let data = {
          quickquiz_id: this.quickquiz._id
        }
        this.$http.post('/api/manage-quickquiz/teacher/end', data).then(function (response) {
          if (response.data.success) {
            window.location.reload()
          } else {
            console.log(response.data)
          }
        }, function (response) {
          this.$showToast('Error:' + response.data)
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
        this.socket.on('studentJoin', function (studentPayload) {
          console.log('studentJoin')
          Object.keys(studentPayload).forEach((id) => {
            var student
            if (self.students[id]) {
              student = JSON.parse(JSON.stringify(self.students[id]))
            } else {
              student = studentPayload[id]
            }
            student.online = true
            self.updateQuizDashboardStudent({id: id, student: student})
          })
        })
        this.socket.on('studentLeave', function (student_id) {
          var student = JSON.parse(JSON.stringify(self.students[student_id]))
          student.online = false
          self.updateQuizDashboardStudent({id: student_id, student: student})
        })
        this.socket.on('studentList', function (data) {
          console.log('on student list')
          if ('studentList' in data && 'studentAnswerReports' in data) {
            let studentList = data.studentList
            let studentAnswerReports = data.studentAnswerReports
            _.forEach(studentList, function (value, student_id) {
              var student
              console.log(self.students[student_id])
              if (self.students[student_id]) {
                student = JSON.parse(JSON.stringify(self.students[student_id]))
              } else {
                student = JSON.parse(value)
              }
              student.online = true
              if (studentAnswerReports && studentAnswerReports[student_id]) {
                let report = JSON.parse(studentAnswerReports[student_id])
                console.log(studentAnswerReports[student_id])
                student.correct = report.correct
                student.incorrect = report.incorrect
                student.unstarted = report.unstarted
                student.started = report.correct + report.incorrect
              }
              self.updateQuizDashboardStudent({id: student_id, student: student})
            })
            if (data.studentAnswerReports) {
              self.drawRealtimeChart()
            }
          }
        })
        this.socket.on('studentAnswerReport', function (data) {
          if (data.student && data.report) {
            var student = JSON.parse(JSON.stringify(self.students[data.student]))
            let scoreResult = data.report
            student.correct = scoreResult.correct
            student.incorrect = scoreResult.incorrect
            student.unstarted = scoreResult.unstarted
            student.started = scoreResult.correct + scoreResult.incorrect
            self.updateQuizDashboardStudent({id: data.student, student: student})
            self.throttledDrawRealtimeChart()
          }
        })
        this.socket.on('studentHandin', function (data) {
          if (data.student && data.quizsample) {
            var student = JSON.parse(JSON.stringify(self.students[data.student]))
            student.finished = true
            student.quizsample = data.quizsample._id
            student.score = data.quizsample.score
            self.updateQuizDashboardStudent({id: data.student, student: student})
          }
        })
        this.socket.on('reconnecting', function () {
          console.log('reconnecting')
        })
        this.socket.on('authenticated', function () {
          self.socket.emit('user join', { quickquizId: self.$route.params.quickquiz_id })
        })
        this.socket.on('unauthorized', function (error) {
          if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token') {
            self.$showToast('登入憑證過期，重新驗證身份')
            this.showLoginModal()
          } else {
            console.log('unauthorized: ' + JSON.stringify(error.data))
            self.$showToast('Error:' + error.data)
          }
        })
      }
    },
    handleStudentOnClick (student) {
      console.log(student && student.finished && student.quizsample)
      if (student && student.finished && student.quizsample) {
        this.$router.push({name: 'quiz-sample-paper', params: {quickquiz_id: this.$route.params.quickquiz_id, quizsample_id: student.quizsample}})
      }
      console.log(student)
    },
    analysisStudentsSamples (quizsamples) {
      console.log('analysis')
      var self = this
      if (quizsamples.length > 0) {
        quizsamples.forEach((sample, index) => {
          let student_id = sample.student._id
          if (self.students[student_id]) {
            let student = JSON.parse(JSON.stringify(self.students[student_id]))
            if (sample.finishAt) {
              student.finishAt = sample.finishAt
              student.quizsample = sample._id
              student.score = sample.score
              student.finished = true
              if (sample.finishAt > self.quickquiz.endAt) {
                student.overtime = true
              }
            } else {
              student.finished = false
            }
            self.updateQuizDashboardStudent({id: student_id, student: student})
          } else {
            var student = {
              id: student_id,
              name: sample.student.name
            }
            if (sample.finishAt) {
              student.finishAt = sample.finishAt
              student.quizsample = sample._id
              student.score = sample.score
              student.finished = true
              if (sample.finishAt > self.quickquiz.endAt) {
                student.overtime = true
              }
            } else {
              student.finished = false
            }
            self.updateQuizDashboardStudent({id: student_id, student: student})
          }
        })
      }
    },
    drawRealtimeChart (options) {
      var self = this
      self.setRealtimeChartStatus(true)
      if (self.realtimeChart !== null) {
        Object.keys(self.students).forEach(function (id, index) {
          let student = self.students[id]
          if (!isNaN(self.realtimeChartDic[id])) {
            let index = self.realtimeChartDic[id]
            self.realtimeChart.data.datasets[index].data[0].x = student.started
            self.realtimeChart.data.datasets[index].data[0].y = student.correct
          } else {
            if (student.started) {
              let newIndex = self.realtimeChart.data.datasets.length
              self.realtimeChart.data.datasets.push({
                label: student.name,
                data: [{
                  x: student.started,
                  y: student.correct,
                  r: 15
                }]
              })
              self.realtimeChartDic[id] = newIndex
            }
          }
        })
        self.realtimeChart.update()
      } else {
        let startedStudents = _.filter(self.students, function (student) { return student.started })
        let dataSets = startedStudents.map(function (studentObj, index) {
          let student = studentObj
          console.log(student)
          self.realtimeChartDic[student.id] = index
          var obj = {}
          obj.label = student.name
          obj.data = []
          obj.data.push({
            x: student.started,
            y: student.correct,
            r: 15
          })
          return obj
        })
        let ctx = this.$refs.realtimeChart
        var data = {
          datasets: dataSets
        }
        self.realtimeChart = new Chart(ctx, {
          type: 'bubble',
          data: data,
          options: {
            autoSkip: false,
            elements: {
              points: {
                borderWidth: 1,
                borderColor: 'rgb(0, 0, 0)'
              }
            },
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  min: 0,
                  max: self.quickquiz.questions.length,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: '正確題數'
                }
              }],
              xAxes: [{
                display: true,
                ticks: {
                  min: 0,
                  max: self.quickquiz.questions.length,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: '完成題數'
                }
              }]
            }
          }
        })
        self.realtimeChart.render(500, false)
      }
    },
    drawCharts: function () {
      let self = this
      if (_.get(self.quickquiz, 'finished', false)) {
        this.drawSPChart()
        this.drawQAChart()
      }
    },
    drawSPChart: function (sort, type) {
      let self = this
      let studentCount = this.students.length
      let student_performance_chart = this.$refs.spChart
      student_performance_chart.height = 20 * studentCount

      if (spChart !== null) {
        spChart.destroy()
      }
      // initialise data
      let name_set = _.map(this.students, function (student) { return student.name })
      let time_cost_set = _.map(this.students, function (student, key) {
        return self.analysisSample(key, 'timeInMilliSec') / 60000
      })
      let correct_count_set = _.map(this.students, function (student, key) {
        return self.analysisSample(key, 'rightCount')
      })

      let ave_correct_count = self.analysis('average_right_count')
      let ave_correct_data_set = _.times(studentCount, _.constant(ave_correct_count))

      // [{'name', 'correctCount', 'timeCost'}]
      var chart_main_data = _.zip(name_set, time_cost_set, correct_count_set)

      if (sort === 'correct') {
        if (this.charts.sp.correct !== 1) {
          this.charts.sp.correct = 1
          chart_main_data = _.sortBy(chart_main_data, function (data) { return data[2] })
        } else {
          this.charts.sp.correct = -1
          chart_main_data = _.sortBy(chart_main_data, function (data) { return -data[2] })
        }
      } else if (sort === 'time') {
        if (this.charts.sp.time !== 1) {
          this.charts.sp.time = 1
          chart_main_data = _.sortBy(chart_main_data, function (data) { return data[1] })
        } else {
          this.charts.sp.time = -1
          chart_main_data = _.sortBy(chart_main_data, function (data) { return -data[1] })
        }
      }

      var spChartdata = {
        labels: _.unzip(chart_main_data)[0],
        datasets: [
          {
            label: '時間',
            backgroundColor: 'rgba(255,152,0,0.2)',
            borderColor: 'rgba(255,152,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,152,0,0.4)',
            hoverBorderColor: 'rgba(255,152,0,1)',
            data: _.unzip(chart_main_data)[1]
          },
          {
            label: '正確題數',
            backgroundColor: 'rgba(76, 175, 80 ,0.2)',
            borderColor: 'rgba(76, 175, 80 ,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(76, 175, 80 ,0.4)',
            hoverBorderColor: 'rgba(76, 175, 80 ,1)',
            data: _.unzip(chart_main_data)[2]
          },
          {
            label: '平均正確題數',
            type: 'line',
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            borderColor: 'rgba(63, 81, 181, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(63, 81, 181, 0.4)',
            hoverBorderColor: 'rgba(63, 81, 181, 1)',
            data: ave_correct_data_set
          }
        ]
      }

      spChart = new Chart(student_performance_chart, {
        type: 'horizontalBar',
        data: spChartdata
      })
      spChart.render(500, false)
    },
    drawQAChart: function (sort, type) {
      let questionCount = this.quickquiz.questions
      let question_analysis_chart = this.$refs.qaChart
      question_analysis_chart.height = 30 * questionCount

      if (qaChart !== null) {
        qaChart.destroy()
      }

      // initialise data
      let labels_set = _.map(_.times(this.quickquiz.questions, Number), function (number) { return '第' + (number + 1) + '題' })
      let correct_count_set = _.map(this.quickquiz.analysis.questions, function (question, key) {
        return question[0]
      })
      let wrong_count_set = _.map(this.quickquiz.analysis.questions, function (question, key) {
        return question[1]
      })
      let blank_count_set = _.map(this.quickquiz.analysis.questions, function (question, key) {
        return question[2]
      })

      var main_chart_data = _.zip(labels_set, correct_count_set, wrong_count_set, blank_count_set)

      if (sort === 'correct') {
        if (this.charts.qa.correct !== 1) {
          this.charts.qa.correct = 1
          main_chart_data = _.sortBy(main_chart_data, function (data) { return data[1] })
        } else {
          this.charts.qa.correct = -1
          main_chart_data = _.sortBy(main_chart_data, function (data) { return -data[1] })
        }
      }

      var qaChartData = {
        labels: _.unzip(main_chart_data)[0],
        datasets: [
          {
            label: '正確',
            backgroundColor: 'rgba(76, 175, 80 ,0.2)',
            borderColor: 'rgba(76, 175, 80 ,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(76, 175, 80 ,0.4)',
            hoverBorderColor: 'rgba(76, 175, 80 ,1)',
            data: _.unzip(main_chart_data)[1]
          },
          {
            label: '錯誤',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: _.unzip(main_chart_data)[2]
          },
          {
            label: '留空',
            backgroundColor: 'rgba(255,152,0,0.2)',
            borderColor: 'rgba(255,152,0,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,152,0,0.4)',
            hoverBorderColor: 'rgba(255,152,0,1)',
            data: _.unzip(main_chart_data)[3]
          }
        ]
      }

      qaChart = new Chart(question_analysis_chart, {
        type: 'horizontalBar',
        data: qaChartData
      })
      qaChart.render(500, false)
    },
    // mockData: function () {
    //   let self = this
    //
    //   let student = {
    //     _id: '56a32a089776051346bf694d',
    //     name: 'mockData',
    //     online: true
    //   }
    //   self.updateQuickquizStudent(0, student)
    // },
    deleteQuiz: function () {
      if (this.quickquiz.finished) {
        let data = {
          quickquiz_id: this.quickquiz._id
        }
        this.$http.delete('/api/manage-quickquiz/quickquiz', data).then(function (response) {
          this.$router.push({
            name: 'quiz-results'
          })
        }, function (response) {
          this.$showToast(response.data)
        })
      }
    },
    routeToQuizPaper () {
      this.$router.push({name: 'quiz-detail-paper'})
    },
    ...mapActions({
      showLoginModal: 'showLoginModal',
      setRealtimeChartStatus: 'setQuizDashboardRCStatus',
      setQuizDashboardQuiz: 'setQuizDashboardQuiz',
      setQuizDashboardStudents: 'setQuizDashboardStudents',
      setQuizDashboardQuizsamples: 'setQuizDashboardQuizsamples',
      updateQuizDashboardStudent: 'updateQuizDashboardStudent'
    })
  },
  computed: {
    throttledDrawRealtimeChart: function () {
      return _.throttle(this.drawRealtimeChart, 1000)
    },
    ...mapGetters({
      quizsamples: 'quizDashboardQuizsamples',
      quickquiz: 'quizDashboardQuiz',
      students: 'quizDashboardStudents',
      realtimeChartShow: 'quizDashboardRCShow'
    })
  }
}
</script>
<style scoped>
.wrapper {
  margin: 16px;
}

.second-wrapper {
  background: #fff;
  margin-top: 16px;
}

.quiz-title {
  margin:0
}

.quiz-finished {
  margin-left: 8px;
  font-size: 18px;
  color: #FF9800
}

.quiz-time {
  color: #2196F3;
  font-size: 18px;
  margin-left: 16px
}

.quiz-time i{
  font-size: 18px;
  margin-right: 4px
}

.quiz-questions-count {
  color: #2196F3;
  font-size: 18px;
  margin-left: auto;
}

.quiz-questions-count i{
  font-size: 18px;
  margin-right: 4px
}

.student-status {
  background-color: #9E9E9E;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 5px;
}

.student-finished {
  margin-left: 8px;
  font-size: 14px;
  color: #FF9800
}

.student-status.online {
  background-color: #4CAF50;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 5px;
}

.student {
  padding: 8px 16px;
  cursor: pointer;
}

.student .student-name {
  font-size: 18px;
  padding: 8px 0
}

.student .doing-status {
  color: #009688;
  justify-content: center;
}

.student .unfinish-status {
  color: #9E9E9E;
  justify-content: center;
}

.student .finished-status {
  color: #009688;
  margin-left: auto;
  cursor: pointer;
}

.student .doing-status {
  color: #3F51B5;
  text-align: center;
  cursor: pointer;
}
</style>
