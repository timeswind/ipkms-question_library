<template>
  <div id="quiz-detail">
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mu-raised-button raised primary @click.native="$goBack()"><i class="material-icons">keyboard_arrow_left</i>返回</mu-raised-button>
        <mu-raised-button v-if="quickquiz.finished" style="margin-left:16px" raised><i class="material-icons" style="font-size:20px;margin-right:4px">redo</i>再測一次</mu-raised-button>
        <mu-raised-button v-if="!quickquiz.finished" style="margin-left:16px" raised accent @click.native="endQuiz()"><i class="material-icons" style="font-size:20px;margin-right:4px">gavel</i>結束小測</mu-raised-button>
        <mu-raised-button style="margin-left:16px" raised primary @click.native="checkQuizPaper()"><i class="material-icons" style="font-size:20px;margin-right:4px">description</i>查看试卷</mu-raised-button>
        <mu-raised-button v-if="quickquiz.finished" raised accent @click.native="deleteQuiz()" style="margin-left: 16px"><i class="material-icons">delete</i>刪除小測</mu-raised-button>
      </div>
      <div class="flex-column second-wrapper light-card">
        <div class="flex-column" style="padding:16px">
          <div class="flex-row flex-baseline">
            <h4 class="quiz-title">{{quickquiz.title}}</h4>
            <span class="quiz-finished">{{quickquiz.finished | finished}}</span>
            <span class="flex-row flex-center quiz-questions-count"><i class="material-icons">description</i><span>{{quickquiz.questions}}題</span></span>
            <span class="flex-row flex-center quiz-time"><i class="material-icons">timer</i><span>{{quickquiz.time}}分鐘</span></span>
          </div>
        </div>

        <div class="flex-row flex-center" style="border-top:1px solid #eee;">
          <span class="flex-column flex-50" style="padding: 16px;border-right:1px solid #eee;">
            <span class="field-title">開始於</span>
            <span class="field-content">{{quickquiz.startTime | date('YYYY[年]M[月]DD[日] H:mm')}}</span>
          </span>
          <span class="flex-column flex-50" style="padding: 16px;border-right:1px solid #eee;">
            <span class="field-title">結束於</span>
            <span class="field-content">{{quickquiz.finishTime | date('YYYY[年]M[月]DD[日] H:mm')}}</span>
          </span>
        </div>

        <div class="flex-column" v-show="students && students.length > 0">
          <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">學生 {{students.length}}名</p>
          <div class="grids">

            <div class="grid-4 flex-column student" v-for="(student, index) in students" v-bind:key="student._id" @click="checkQuizPaper(student)">
              <div class="flex-row flex-center">
                <div class="student-status online" v-show="student.online"></div>
                <span class="student-name">{{student.name}}</span>
              </div>
              <span class="finished-status flex-row flex-center" v-if="student.status === 'finish'">
                <span style="margin-right:8px;color:#3F51B5">{{analysisSample(index, 'time')}}</span>
                <span style="color: #E91E63;margin-right: 8px;">{{analysisSample(index, 'score')}}</span>
                <span>已完成</span>
                <i class="material-icons">keyboard_arrow_right</i>
              </span>
              <span class="unfinish-status flex-row flex-center" v-show="!student.status">
                <span>未上交</span>
                <i class="material-icons">short_text</i>
              </span>
              <span class="doing-status flex-row flex-center" v-show="student.status === 'doing'" @click.native="checkQuizPaper(student)">
                <span>做卷中&nbsp;</span>
                <i class="material-icons">keyboard_arrow_right</i>
              </span>
            </div>
          </div>
        </div>

        <div class="flex-column" v-show="statisticShow">
          <p style="padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa;border-top:1px solid #eee;">數據 統計</p>
          <div class="flex-row grids" v-if="quickquiz.finished">
            <div class="grid-2 flex-column flex-center flex-50">
              <span class="field-title">平均分</span>
              <span class="field-content">{{analysis('average_score')}}</span>
            </div>
            <div class="grid-2 flex-column flex-center flex-50">
              <span class="field-title">平均用時</span>
              <span class="field-content">{{analysis('average_time')}}</span>
            </div>
          </div>
          <div class="flex-row flex-center" style="margin-top: 16px">
            <span style="margin: 16px 16px 16px 32px; font-size: 26px;">學生表現</span>
            <mu-raised-button accent raised @click.native="drawSPChart('time')" style="background-color: #FF9800;">
              <i class="material-icons">swap_vert</i>
              <span>時間</span>
            </mu-raised-button>
            <mu-raised-button accent raised style="margin-left:16px" @click.native="drawSPChart('correct')">
              <i class="material-icons">swap_vert</i>
              <span>正確題數</span>
            </mu-raised-button>
          </div>
          <canvas ref="spChart"></canvas>
          <div class="flex-row flex-center" style="margin-top:32px;border-top:1px solid #ddd;padding-top:16px">
            <span style="margin: 16px 16px 16px 32px; font-size: 26px;">題目數據</span>
            <mu-raised-button accent raised @click.native="drawQAChart('correct')">
              <i class="material-icons">swap_vert</i>
              <span>正確數量</span>
            </mu-raised-button>
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
import { zipSampleToStudent, studentIndex } from '../../modules/quickquiz'
import { isMongodbId } from '../../modules/mongodb'

var socket = null
var qaChart = null
var spChart = null
export default {
  mounted: function () {
    this.$nextTick(function () {
      let quickquiz_id = this.$route.params.quickquiz_id
      if (isMongodbId(quickquiz_id)) {
        this.validateURL = true
        this.getQuickquizDetail(quickquiz_id)
      } else {
        console.log('invalid quickquiz id')
      }
    })
  },
  destroyed: function () {
    this.$nextTick(function () {
      socket.io.disconnect()
      console.log('emit socket disconnect')
    })
  },
  methods: {
    getQuickquizDetail: function (id) {
      console.log('getQuickquizDetail')
      let apiURL = '/api/manage-quickquiz/teacher/quickquiz/' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        let students = _.get(response.data, 'students', [])
        this.setQuickquizStudents(students)
        this.samples = _.get(response.data, 'samples', [])
        console.log()
        delete response.data.students
        delete response.data.samples
        this.quickquiz = response.data
        this.analysis('count_exception')
        if (!_.get(response.data, 'finished', false)) {
          this.statisticShow = false
        } else {
          this.statisticShow = true
        }
        this.listenForSocket()
      }, function (response) {
        this.$showToast('Error:' + response.data)
      })
    },
    endQuiz: function () {
      if (this.quickquiz.finished === false) {
        let data = {
          quickquiz_id: this.quickquiz._id
        }
        this.$http.post('/api/manage-quickquiz/teacher/quickquiz/end', data).then(function (response) {
          this.quickquiz.finished = true
          window.location.reload()
        }, function (response) {
          this.$showToast('Error:' + response.data)
        })
      }
    },
    listenForSocket: function () {
      var self = this
      socket = io.connect('/quickquiz')

      socket.on('connect', function () {
        socket
        .emit('authenticate', { token: window.sessionStorage.token }) // send the jwt
        .on('authenticated', function () {
          self.socket.authenticated = true
          socket.emit('user join', { quickquizId: self.$route.params.quickquiz_id })
          console.log('socket auth success')
        })
        .on('unauthorized', function (msg) {
          console.log('unauthorized: ' + JSON.stringify(msg.data))
          throw new Error(msg.data.type)
        })
      })

      // socket.on('authenticated', function () {
      //   self.socket.authenticated = true
      //   socket.emit('user join', {quickquizId: self.$route.params.quickquiz_id})
      //   console.log('socket auth success')
      // })

      socket.on('joined', function (data) {
        self.socket.joined = true
      })

      socket.on('student list', function (data) {
        // @param data = { id: String, status: String } , array of student who are doing the quickquiz
        let students = data
        console.log('on receiving Student List')

        for (var i = 0; i < students.length; i++) {
          let index = studentIndex(self.students, students[i].id)
          if (index > -1) {
            let student = self.students[index]
            student['online'] = true
            if (students[i].status !== '') {
              student['status'] = students[i].status
            }
            if (students[i].quizsample !== '' && !_.has(student, 'sample._id')) {
              let sample = {
                _id: students[i].quizsample
              }
              student['sample'] = sample
            }
            self.updateQuickquizStudent(index, student)
          }
        }
      })

      socket.on('student joined', function (data) {
        console.log('on Student Joined')
        // let student_name = _.get(data, 'name', null)
        let student_id = _.get(data, 'id', null)
        let student_name = _.get(data, 'name', null)

        let index = studentIndex(self.students, student_id)
        if (index > -1) {
          let student = self.students[index]
          student['online'] = true
          self.updateQuickquizStudent(index, student)
        } else {
          let student = {
            _id: student_id,
            name: student_name,
            online: true
          }
          self.updateQuickquizStudent(self.students.length, student)
        }
      })

      socket.on('student leaved', function (data) {
        console.log('on Student Leaved')
        let index = studentIndex(self.students, data)
        if (data && index > -1) {
          let student = self.students[index]
          student['online'] = false
          if (_.get(student, 'status', null) !== 'finish') {
            student['status'] = null
          }
          self.updateQuickquizStudent(index, student)
        }
      })

      socket.on('start doing', function (data) {
        if (data) {
          let index = studentIndex(self.students, data.student)
          if (data && index > -1) {
            let student = self.students[index]
            student['status'] = 'doing'
            if (!_.has(student, 'sample._id')) {
              let sample = {
                _id: data.quizsample
              }
              student['sample'] = sample
            }
            self.updateQuickquizStudent(index, student)
          }
        }
        console.log('student ' + data + ' just start doing the quiz')
      })

      socket.on('finish doing', function (data) {
        if (data) {
          let index = studentIndex(self.students, data)
          if (data && index > -1) {
            let student = self.students[index]
            student['status'] = 'finish'
            self.updateQuickquizStudent(index, student)
          }
        }
        console.log('student ' + data + ' just finished the quiz')
      })
    },
    checkSamples: function () {
      if (this.samples.length > 0) {
        this.setQuickquizStudents(zipSampleToStudent(this.samples, this.students))
        this.setQuickquizID(this.quickquiz._id)
        this.setQuickquizStudents(this.students)
        this.drawCharts()
      }
    },
    analysisSample: function (student_index, option) {
      let sample = this.students[student_index].sample

      if (option === 'score') {
        let rightCount = sample.results.right.length
        let total = sample.results.right.length + sample.results.blank.length + sample.results.wrong.length
        return rightCount + '/' + total
      } else if (option === 'time') {
        let start = sample.startTime
        let finish = sample.finishTime
        return this.timeDifference(Math.abs(new Date(start) - new Date(finish)), 'simple')
      } else if (option === 'rightCount') {
        let rightCount = sample.results.right.length
        return rightCount
      } else if (option === 'timeInMilliSec') {
        let start = sample.startTime
        let finish = sample.finishTime
        return Math.abs(new Date(start) - new Date(finish))
      }
    },
    analysis: function (option) {
      if (option === 'average_score') {
        return (this.quickquiz.analysis.aveRight * 100 / (this.quickquiz.questions - this.quickquiz.exception)).toFixed(2)
      } else if (option === 'average_time') {
        return this.timeDifference(this.quickquiz.analysis.aveTime)
      } else if (option === 'average_right_count') {
        return (this.quickquiz.analysis.aveRight.toFixed(2)) / 1
      } else if (option === 'count_exception') {
        var exception_count = 0
        let question_analysis = this.quickquiz.analysis.questions
        _.forEach(question_analysis, function (array) {
          if (array[0] === 0 && array[1] === 0 && array[2] === 0 && array[3] > 0) {
            exception_count++
          }
        })
        this.quickquiz['exception'] = exception_count
        this.checkSamples()
      } else {
        return false
      }
    },
    timeDifference: function (millisecound, option) {
      var ms = millisecound
      var min = (ms / 1000 / 60) << 0
      var sec = (ms / 1000) % 60 << 0
      if (option === 'simple') {
        return (min + ':' + sec)
      } else {
        return (min + '分' + sec + '秒')
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
    checkQuizPaper: function (student) {
      if (student) {
        if (_.has(student, 'sample._id')) {
          this.$router.push({
            name: 'quiz-paper',
            params: { quickquiz_id: this.$route.params.quickquiz_id, quizsample_id: student.sample._id }
          })
        }
      } else {
        this.$router.push({
          name: 'quiz-paper',
          params: { quickquiz_id: this.$route.params.quickquiz_id, quizsample_id: 0 }
        })
      }
    },
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
    ...mapActions({
      setQuickquizID: 'setQuickquizID',
      setQuickquizStudents: 'setQuickquizStudents',
      updateQuickquizStudent: 'updateQuickquizStudent'
    })
  },
  data () {
    return {
      socket: {
        joined: false,
        authenticated: false
      },
      statisticShow: false,
      validateURL: false,
      quickquiz: {},
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
  computed: mapGetters({
    getQuickquizID: 'getQuickquizID',
    students: 'getQuickquizStudents'
  })
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
