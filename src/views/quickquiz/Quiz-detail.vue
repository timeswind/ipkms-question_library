<style>
#quiz-detail .wrapper {
  margin: 16px;
}

#quiz-detail .second-wrapper {
  background: #fff;
  margin-top: 16px;
}

#quiz-detail .quiz-title {
  margin:0 0 16px 0
}

#quiz-detail .quiz-starttime, #quiz-detail .quiz-finishtime {
  color: #9e9e9e;
  font-size: 14px
}

#quiz-detail .quiz-finished {
  margin-left: 8px;
  font-size: 18px;
  color: #FF9800
}

#quiz-detail .quiz-time {
  color: #2196F3;
  font-size: 18px;
  margin-left: 16px
}

#quiz-detail .quiz-time i{
  font-size: 18px;
  margin-right: 4px
}

#quiz-detail .quiz-questions-count {
  color: #2196F3;
  font-size: 18px;
  margin-left: auto;
}

#quiz-detail .quiz-questions-count i{
  font-size: 18px;
  margin-right: 4px
}

#quiz-detail .student-status {
  background-color: #9E9E9E;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 5px;
}

#quiz-detail .student-status.online {
  background-color: #4CAF50;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 5px;
}

#quiz-detail .student {
  padding: 8px 16px
}

#quiz-detail .student .student-name {
  font-size: 18px;
  padding: 8px 0
}

#quiz-detail .student .doing-status {
  color: #009688;
  text-align: center;
}

#quiz-detail .student .unfinish-status {
  color: #9E9E9E;
  text-align: center;
}

#quiz-detail .student .finished-status {
  color: #009688;
  text-align: center;
}

#quiz-detail .student .doing-status {
  color: #3F51B5;
  text-align: center;
}
</style>
<template>
  <div id="quiz-detail">
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mdl-button class="icon-left-button" raised primary @click="goBack()"><i class="material-icons">keyboard_arrow_left</i>返回</mdl-button>
        <mdl-button v-if="quickquiz.finished" style="margin-left:16px" raised><i class="material-icons" style="font-size:20px;margin-right:4px">redo</i>再測一次</mdl-button>
        <mdl-button v-if="!quickquiz.finished" style="margin-left:16px" raised accent @click="endQuiz()"><i class="material-icons" style="font-size:20px;margin-right:4px">gavel</i>結束小測</mdl-button>
        <mdl-button style="margin-left:16px" raised primary v-link="{'name': 'quiz-paper', params: { quickquiz_id: $route.params.quickquiz_id }}"><i class="material-icons" style="font-size:20px;margin-right:4px">description</i>查看试卷</mdl-button>

      </div>
      <div class="flex-column second-wrapper mdl-shadow--2dp">
        <div class="flex-column" style="padding:16px">

          <div class="flex-row flex-baseline">
            <h4 class="quiz-title">{{quickquiz.title}}</h4>
            <span class="quiz-finished">{{quickquiz.finished | finished}}</span>
            <span class="flex-row flex-center quiz-questions-count"><i class="material-icons">description</i><span>{{quickquiz.questions}}題</span></span>
            <span class="flex-row flex-center quiz-time"><i class="material-icons">timer</i><span>{{quickquiz.time}}分鐘</span></span>
          </div>
          <span class="quiz-starttime">開始於：{{quickquiz.startTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>
          <span class="quiz-finishtime" v-if="quickquiz.finishTime">結束於：{{quickquiz.finishTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>

        </div>

        <div class="flex-column" v-if="quickquiz.students">
          <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">參與的學生</p>
          <div class="grids">

            <div class="grid-4 flex-column student" v-for="student in quickquiz.students" track-by="_id">
              <div class="flex-row flex-center">
                <div class="student-status" :class="{'online': quickquiz.students[$index].online }"> </div>
                <span class="student-name">{{student.name}}</span>
              </div>
              <span class="finished-status" v-show="quickquiz.students[$index].status === 'finish'">已完成</span>
              <span class="unfinish-status" v-show="!quickquiz.students[$index].status">未上交</span>
              <span class="doing-status" v-show="quickquiz.students[$index].status === 'doing'">做卷中</span>
            </div>
          </div>
          <p style="padding:16px 0 16px 0;margin:0;text-align:center;color:#607D8B">一共 {{quickquiz.students.length}} 位學生</p>
        </div>


        <div class="flex-column" v-if="quickquiz.finished">
          <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">數據 統計</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
var socket = null

export default {
  attached: function () {
    if (this.$route.params.quickquiz_id) {
      this.validateURL = true
      this.getQuickquizDetail(this.$route.params.quickquiz_id)
    }
  },
  detached: function () {
    socket.io.disconnect()
    console.log('emit disconnect')
  },
  methods: {
    getQuickquizDetail: function (id) {
      let apiURL = '/api/manage-quickquiz/teacher/quickquiz/' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        console.log(response.data)
        this.quickquiz = response.data
        this.listenForSocket()
        this.checkSamples()
      }, function (response) {
        console.log(response.data)
      })
    },
    endQuiz: function () {
      if (this.quickquiz.finished === false) {
        let data = {
          quickquiz_id: this.quickquiz._id
        }
        this.$http.post('/api/manage-quickquiz/teacher/quickquiz/end', data).then(function (response) {
          this.quickquiz.finished = true
        }, function (response) {
          // handle errors
          console.log(response)
        })
      }
    },
    checkOnline: function (index) {
      return this.students[index].online === true
    },
    getIndexOfStudents: function (student_id) {
      for (var i = 0; i < this.quickquiz.students.length; i++) {
        if (this.quickquiz.students[i]._id === student_id) {
          return i
        }
      }
      return -1
    },
    goBack: function () {
      window.history.back()
    },
    listenForSocket: function () {
      var self = this
      socket = io.connect('/quickquiz')

      socket.on('connect', function () {
        console.log('on connect')
        socket.emit('authenticate', {token: window.sessionStorage.token})
      })

      socket.on('authenticated', function () {
        self.socket.authenticated = true
        socket.emit('user join', {quickquizId: self.$route.params.quickquiz_id})
        console.log('socket auth success')
      })

      socket.on('joined', function (data) {
        self.socket.joined = true
      })

      socket.on('student list', function (data) {
        // @param data = { id: String, status: String } , array of student who are doing the quickquiz
        let students = data
        console.log(students)
        console.log('on receiving Student List')

        for (var i = 0; i < students.length; i++) {
          let index = self.getIndexOfStudents(students[i].id)
          if (index > -1) {
            let student = self.quickquiz.students[index]
            student['online'] = true
            if (students[i].status !== '') {
              student['status'] = students[i].status
            }
            self.quickquiz.students.$set(index, student)
          }
        }
      })

      socket.on('student joined', function (data) {
        console.log('on Student Joined')
        let index = self.getIndexOfStudents(data)
        if (data && index > -1) {
          let student = self.quickquiz.students[index]
          student['online'] = true
          self.quickquiz.students.$set(index, student)
        }
      })

      socket.on('student leaved', function (data) {
        console.log('on Student Leaved')
        let index = self.getIndexOfStudents(data)
        if (data && index > -1) {
          let student = self.quickquiz.students[index]
          student['online'] = false
          self.quickquiz.students.$set(index, student)
        }
      })

      socket.on('start doing', function (data) {
        if (data) {
          let index = self.getIndexOfStudents(data)
          if (data && index > -1) {
            let student = self.quickquiz.students[index]
            student['status'] = 'doing'
            self.quickquiz.students.$set(index, student)
          }
        }
        console.log('student ' + data + ' just start doing the quiz')
      })

      socket.on('finish doing', function (data) {
        if (data) {
          let index = self.getIndexOfStudents(data)
          if (data && index > -1) {
            let student = self.quickquiz.students[index]
            student['status'] = 'finish'
            self.quickquiz.students.$set(index, student)
          }
        }
        console.log('student ' + data + ' just finished the quiz')
      })
    },
    checkSamples: function () {
      if (this.quickquiz.samples.length > 0) {
        let samples = this.quickquiz.samples
        for (var i = 0; i < samples.length; i++) {
          let index = this.getIndexOfStudents(samples[i].student)
          if (index > -1) {
            let student = this.quickquiz.students[index]
            student['status'] = 'finish'
            this.quickquiz.students.$set(index, student)
          }
        }
      }
    }
  },
  data () {
    return {
      socket: {
        joined: false,
        authenticated: false
      },
      validateURL: false,
      quickquiz: {} // include { students: {} }
    }
  },
  filters: {
    finished: function (value) {
      if (value === false) {
        return '未收卷/進行中'
      } else {
        return '已結束'
      }
    }
  }
}
</script>
