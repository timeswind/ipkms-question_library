<style>
#quiz-paper .wrapper {
  margin: 16px;
}
#quiz-paper .second-wrapper {
  display: flex;
  flex-direction: row;
  margin: 16px 0;
  align-items: center;
  justify-content: center;
}

#quiz-paper .third-wrapper {
  flex-basis: auto;
  flex-grow: 1;
  max-width: 800px;
}

#quiz-paper .title {
  font-size: 20px;
  font-weight: bold
}

#quiz-paper .time {
  font-size: 16px;
  align-items: center;
}

#quiz-paper .time i {
  font-size: 20px;
  margin-right: 4px
}

#quiz-paper .author {
  font-size: 15px;
  margin-top: 8px;
  color: #9E9E9E;
}

#quiz-paper .question div,#quiz-paper .question p{
  margin-bottom:0 !important
}

#quiz-paper .index-label {
  font-weight: bold;
  font-size: 20px;
  padding: 0;
  margin-right: 16px;
}

#quiz-paper .question_body>p, #quiz-paper .question_body>div{
  font-size: 16px;
  padding-left: 16px;
  margin-bottom:0;
}

#quiz-paper .accuracy {
  cursor: pointer;
  margin-top: 4px;
  color: #FF9800;
}

#quiz-paper .choices {
  border-top:1px solid #eee;
}

#quiz-paper .choose {
  box-shadow: inset 0 0 0 4px #3f51b5;
}

#quiz-paper .right {
  background-color: #009688;
  color: #fff;
}

#quiz-paper .wrong {
  background-color: #F44336;
  color: #fff;
}

#quiz-paper .blank {
  background-color: #FFC107;
  color: #fff;
}

#quiz-paper .choice {
  padding: 16px;
  align-items: baseline;
}

#quiz-paper .choice-a {
  border-right:1px solid #eee;
  border-bottom:1px solid #eee;
}

#quiz-paper .choice-b {
  border-bottom:1px solid #eee;
}

#quiz-paper .choice-c {
  border-right:1px solid #eee;
}

#quiz-paper .choice-label {
  padding-right: 16px;
}

#quiz-paper .question-checkbox {
  width: 20%
}

#quiz-paper .overlay {
  background: #fff;
  height: 100%;
  width: 100%;
  opacity: 0;
  top: 0;
  left: 100px;
  position: absolute;
  padding: 0;
  transition: all ease .5s;
  z-index: -1;
}
#quiz-paper .card {
  position: relative;
}
#quiz-paper .overlay_show {
  opacity: 1;
  left: 0;
  z-index: 2
}
#quiz-paper .rightPeople_header {
  font-size: 18px;
  color: #009688;
  padding-bottom: 4px;
  border-bottom: 2px solid #009688;
  margin-bottom: 4px;
}
#quiz-paper .wrongPeople_header {
  font-size: 18px;
  color: #F44336;
  padding-bottom: 4px;
  border-bottom: 2px solid #F44336;
  margin-bottom: 4px;
}

#quiz-paper .obserMode_flag {
  position: fixed;
  top: 78px;
  right: 32px;
  z-index: 2;
  box-shadow: 1px 1px 3px #aaa;
  padding: 16px;
  background-color: #FF9800;
  border-radius: 3px
}
</style>
<template>
  <div id="quiz-paper">
    <div class="flex-column" v-show="modalShow">
      question analysis model
    </div>
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mdl-button class="icon-left-button" raised primary @click.native="$goBack()"><i class="material-icons">keyboard_arrow_left</i>返回</mdl-button>
        <mdl-button class="icon-left-button" raised accent v-show="!sampleMode || observeMode" @click.native="showAnswers()" style="margin-left:16px;">
          <i class="material-icons" style="margin-right: 8px">visibility</i>
          <span>顯示 / 隱藏答案</span>
        </mdl-button>
      </div>

      <div v-if="observeMode" class="obserMode_flag flex-column flex-center">
        <span style="font-size:18px;color:#FFFFFF" class="flex-row flex-center">
          <i class="material-icons">visibility</i>
          <span>&nbsp;觀察模式</span>
        </span>
      </div>

      <div class="second-wrapper">
        <div class="third-wrapper">
          <card v-if="sampleMode && !quickquiz.finished">
            <div slot="content" class="flex-column" style="padding:16px;text-align:center;font-size: 16px;color: #FF9800;">
              測驗尚未結束，未統計數據
            </div>
          </card>
          <card>
            <div slot="content" class="flex-column" style="padding:16px" v-if="quickquiz.title">
              <span class="flex-row flex-center">
                <span v-show="sampleMode" style="font-size:16px;padding: 4px 8px;margin-right:8px;background:#2196F3;color:#fff">答卷</span>
                <span class="title">{{quickquiz.title}}</span>
                <span class="time flex-row" style="margin-left:auto"><i class="material-icons">timer</i>{{quickquiz.time}}分鐘</span>
              </span>
              <span class="author">出卷人: {{quickquiz.createdBy.name}}</span>
              <div v-if="sampleMode && quizsample.student" style=" border-top:1px solid #ddd;margin-top:16px;padding-top: 16px">
                <span class="flex-row flex-center">
                  <span class="flex-column" style="margin-right: 16px">
                    <span class="field-title">姓名</span>
                    <span class="field-content">{{quizsample.student.name}}</span>
                  </span>
                  <span class="flex-column" style="margin-right: 32px">
                    <span class="field-title">學號</span>
                    <span class="field-content">{{quizsample.student.schoolId}}</span>
                  </span>
                  <span class="flex-row" style="margin-left: auto" v-if="!observeMode">
                    <span class="flex-column" style="margin-right: 32px">
                      <span class="field-title">正確題數</span>
                      <span class="field-content">{{getQuizScore()}}</span>
                    </span>
                    <span class="flex-column" style="margin-right: 32px">
                      <span class="field-title">分數(100)</span>
                      <span class="field-content">{{getQuizScore('percentage')}}</span>
                    </span>
                  </span>
                </span>
                <span class="flex-row flex-center" style="margin-top: 16px;padding-top:16px; border-top:1px solid #ddd">
                  <span class="flex-column flex-33">
                    <span class="field-title">开始于</span>
                    <span class="field-content">{{quizsample.startTime | date('YY[年]M[月]DD[日]hh[時]mm[分]')}}</span>
                  </span>
                  <div class="flex-row flex-66" v-if="quizsample.finishTime">
                    <span class="flex-column flex-50" >
                      <span class="field-title">完成于</span>
                      <span class="field-content">{{quizsample.finishTime | date('YY[年]M[月]DD[日]hh[時]mm[分]')}}</span>
                    </span>
                    <span class="flex-column flex-50">
                      <span class="field-title">用時</span>
                      <span class="field-content">{{timeDifference(quizsample.startTime, quizsample.finishTime)}}</span>
                    </span>
                  </div>

                </span>
              </div>
            </div>
          </card>

          <card v-if="sampleMode && !observeMode && quizsample.finishTime">
            <div slot="content" class="flex-row flex-wrap" style="padding:16px">
              <div class="flex-row question-checkbox flex-center" v-for="i in quickquiz.questions.length">
                <span style="margin-right: 8px; font-weight:bold; font-size: 16px">{{i}}.</span>

                <span v-if="checks[i - 1] == null" style="color:#FFC107;cursor:pointer" :id="'qchecks_' + (i - 1)"><i class="material-icons">report_problem</i></span>
                <div class="flex-row flex-center" v-if="checks[i - 1] !== null">
                  <span v-if="checks[i - 1] === true" style="color:#009688"><i class="material-icons">check_box</i></span>
                  <span v-if="checks[i - 1] === false" style="color:#F44336"><i class="material-icons">cancel</i></span>
                  <span style="margin-left: 8px; color: #009688;">{{accuracy[i - 1]}}</span>
                </div>
                <mdl-tooltip :for="'qchecks_' + (i - 1)" large class="flex-column">
                  題目被刪除或者缺少答案
                </mdl-tooltip>
              </div>

            </div>
          </card>
          <div id="question-body">
            <card v-for="(question, index) in quickquiz.questions" v-bind:key="question._id" class="question" :id="'question_' + index">
              <div v-if="typeof question === 'object'" slot="content" class="flex-column">
                <div class="overlay flex-column" :class="{'overlay_show': overlay.on === index}">
                  <div class="flex-row" style="justify-content: flex-end">
                    <mdl-button icon @click.native="hideOverlay()">
                      <i class="material-icons">close</i>
                    </mdl-button>
                  </div>
                  <div v-if="overlay.type === 0">
                    <div class="flex-row">
                      <div class="flex-50 flex-column" style="padding: 0 16px 16px 16px">
                        <span class="rightPeople_header">正確 {{accuracy[index]}}</span>
                        <p>{{question.rightPeople}}</p>
                      </div>
                      <div class="flex-50 flex-column" style="padding: 0 16px 16px 16px">
                        <span class="wrongPeople_header">錯誤</span>
                        <p>{{question.wrongPeople}}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <canvas :id="'qaChart_' + index"></canvas>
                  </div>

                </div>
                <span class="flex-row flex-center" style="padding:16px">
                  <div class="flex-column flex-center">
                    <span class="index-label">{{index + 1}}</span>
                    <div class="flex-column flex-center" v-if="quickquiz.finished">
                      <span class="accuracy" :id="'analysis_' + index" @click.native="showOverlay(index, 1)">{{accuracy[index]}}</span>
                      <mdl-tooltip :for="'analysis_' + index" large class="flex-column">
                        <div class="flex-row" style="margin-bottom:8px">
                          <span style="margin-right:4px">正確: {{quickquiz.analysis.questions[index][0]}}</span>
                          <span>錯誤: {{quickquiz.analysis.questions[index][1]}}</span>
                        </div>
                        <div class="flex-row">
                          <span style="margin-right:4px">留空: {{quickquiz.analysis.questions[index][2]}}</span>
                          <span>例外: {{quickquiz.analysis.questions[index][3]}}</span>
                        </div>
                      </mdl-tooltip>
                    </div>
                  </div>
                  <div v-if="question.delta">
                    <div class="question_body" v-html="renderDelta(question.delta)"></div>
                  </div>
                  <div v-if="question.context">
                    <div class="question_body" v-html="question.context"></div>
                  </div>
                  <div class="flex-row" style="margin-left:auto;flex-shrink: 0" v-if="quickquiz.finished">
                    <mdl-button accent @click.native="showAnswer(index)" v-show="quickquiz.correctAnswers[index] !== null && !sampleMode">
                      <span v-if="typeof correctAnswers[index] === 'number'">隱藏答案</span>
                      <span v-else="correctAnswers[index] === undefined || correctAnswers[index] === null">顯示答案</span>
                    </mdl-button>
                    <mdl-button :id="'menu_' + index" icon>
                      <i class="material-icons">more_vert</i>
                    </mdl-button>
                    <mdl-menu :for="'menu_' + index">
                      <mdl-menu-item @click.native="showOverlay(index, 1)">數據分析</mdl-menu-item>
                      <mdl-menu-item @click.native="showOverlay(index, 0)">學生表現</mdl-menu-item>
                      <mdl-menu-item @click.native="this.$router.push({ name: 'question-detail', params: { question_id: question._id }})">修正題目</mdl-menu-item>
                    </mdl-menu>
                  </div>
                </span>

                <div class="choices flex-column" style="width: 100%">
                  <div v-if="question.delta">
                    <div class="flex-row">
                      <div class="choice choice-a flex-50 flex-row" :class="{'choose': checkChoose(index, 0), 'right': showRight(index, 0), 'wrong': showWrong(index, 0), 'blank': showBlank(index, 0), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 0)">
                        <span class="choice-label">A</span>
                        <div v-html="renderDelta(question.choices[0])"></div>
                      </div>
                      <div class="choice choice-b flex-50 flex-row" :class="{'choose': checkChoose(index, 1), 'right': showRight(index, 1), 'wrong': showWrong(index, 1), 'blank': showBlank(index, 1), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 1)">
                        <span class="choice-label">B</span>
                        <div v-html="renderDelta(question.choices[1])"></div>
                      </div>
                    </div>
                    <div class="flex-row">
                      <div class="choice choice-c flex-50 flex-row" :class="{'choose': checkChoose(index, 2), 'right': showRight(index, 2), 'wrong': showWrong(index, 2), 'blank': showBlank(index, 2), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 2)">
                        <span class="choice-label">C</span>
                        <div v-html="renderDelta(question.choices[2])"></div>
                      </div>
                      <div class="choice choice-d flex-50 flex-row" :class="{'choose': checkChoose(index, 3), 'right': showRight(index, 3), 'wrong': showWrong(index, 3), 'blank': showBlank(index, 3), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 3)">
                        <span class="choice-label">D</span>
                        <div v-html="renderDelta(question.choices[3])"></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="question.context">
                    <div class="flex-row">
                      <div class="choice choice-a flex-50 flex-row" :class="{'choose': checkChoose(index, 0), 'right': showRight(index, 0), 'wrong': showWrong(index, 0), 'blank': showBlank(index, 0), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 0)">
                        <span class="choice-label">A</span>
                        <div v-html="question.choices[0]"></div>
                      </div>
                      <div class="choice choice-b flex-50 flex-row" :class="{'choose': checkChoose(index, 1), 'right': showRight(index, 1), 'wrong': showWrong(index, 1), 'blank': showBlank(index, 1), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 1)">
                        <span class="choice-label">B</span>
                        <div v-html="question.choices[1]"></div>
                      </div>
                    </div>
                    <div class="flex-row">
                      <div class="choice choice-c flex-50 flex-row" :class="{'choose': checkChoose(index, 2), 'right': showRight(index, 2), 'wrong': showWrong(index, 2), 'blank': showBlank(index, 2), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 2)">
                        <span class="choice-label">C</span>
                        <div v-html="question.choices[2]"></div>
                      </div>
                      <div class="choice choice-d flex-50 flex-row" :class="{'choose': checkChoose(index, 3), 'right': showRight(index, 3), 'wrong': showWrong(index, 3), 'blank': showBlank(index, 3), 'chooseable': !sampleMode && !observeMode}" @click.native="answerOnChoose(index, 3)">
                        <span class="choice-label">D</span>
                        <div v-html="question.choices[3]"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div v-else slot="content" class="flex-column">
                <span class="flex-row flex-baseline" style="padding:16px; color:#9E9E9E">
                  <div class="flex-column flex-center">
                    <span class="index-label">{{index + 1}}</span>
                  </div>

                  <span class="question-body" style="margin-left: 16px">該題已從題庫中移除</span>
                </span>

              </div>

            </card>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Chart from 'chart.js'
import Card from '../../components/reuseable/Card'
import { mapGetters, mapActions } from 'vuex'
import { zipSampleToStudent } from '../../modules/quickquiz'
import { calAnswerDiff, posToChoiceLable } from '../../modules/quizpaper/observe-mode'
import io from 'socket.io-client'
import deltaRender from '../../modules/delta-render.js'

var qaChart = null
var socket = null
export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.params.quickquiz_id) {
        let id = this.$route.params.quickquiz_id
        this.validateURL = true
        if (id === this.getQuickquizID) {
          this.getQuickquizQuestions(id)
        } else {
          this.fetchExtraData(id)
        }
      }
    })
  },
  components: {
    Card
  },
  destroyed: function () {
    this.$nextTick(function () {
      if (socket !== null) {
        socket.io.disconnect()
        console.log('emit socket disconnect')
      }
    })
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    getQuickquizQuestions: function (id) {
      var apiURL = '/api/manage-quickquiz/quickquiz' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        this.quickquiz = response.data
        if (this.quickquiz.finished) {
          this.quickquiz.questions = this.analysisSingleQuestionPerformance(this.quickquiz.questions, this.getQuickquizStudents)
        }
        if (this.$route.params.quizsample_id !== '0') {
          this.getSampleDetail(this.$route.params.quizsample_id)
        } else {
          this.sampleMode = false
          this.correctAnswers = _.times(response.data.questions.length, _.constant(null))
          this.answers = _.times(response.data.questions.length, _.constant(null))
        }
        this.renderQuestions()
        this.computeAccuracy()
      }, function (response) {
        console.log(response.data)
      })
    },
    fetchExtraData: function (id) {
      console.log('fetch missing data')
      let apiURL = '/api/manage-quickquiz/teacher/quickquiz/' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        let samples = _.get(response.data, 'samples', [])
        var students = _.get(response.data, 'students', [])
        students = zipSampleToStudent(samples, students)
        this.setQuickquizID(id)
        this.setQuickquizStudents(students)
        this.getQuickquizQuestions(id)
      })
    },
    getSampleDetail: function (id) {
      var self = this
      var apiURL = '/api/manage-quickquiz/teacher/quizsample' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        console.log('receiving sample detail')
        if (_.get(response.data, 'finishTime', false)) {
          this.answers = response.data.answers
          this.rights = response.data.results.right
          this.wrongs = response.data.results.wrong
          this.blanks = response.data.results.blank
          delete response.data.answers
          this.quizsample = response.data
          this.showAnswers()
        } else {
          console.log('enable observeMode')
          this.quizsample = response.data
          this.observeMode = true
          this.answers = _.times(self.quickquiz.questions.length, _.constant(null))
          this.listenForSocket()
          // this.showAnswers()
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    analysisSingleQuestionPerformance: function (questions, students) {
      _.forEach(questions, function (value, key) {
        if (_.isObject(value)) {
          var QPanalysis = {
            rightPeople: [],
            wrongPeople: []
          }
          _.forEach(students, function (student) {
            if (_.indexOf(student.sample.results.right, key) > -1) {
              QPanalysis.rightPeople.push(student.name)
            } else if (_.indexOf(student.sample.results.wrong, key) > -1) {
              QPanalysis.wrongPeople.push(student.name)
            }
          })

          var question = questions[key]
          question['rightPeople'] = QPanalysis.rightPeople
          question['wrongPeople'] = QPanalysis.wrongPeople
          questions[key] = question
        }
      })
      return questions
    },
    renderQuestions: function () {
      setTimeout(function () {
        window.renderMathInElement(
          document.getElementById('question-body'),
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }, 0)
    },
    answerOnChoose: function (index, pos) {
      if (!this.sampleMode) {
        if (this.answers[index] === pos) {
          this.answers[index] = null
          this.$set(this.answers, index, null)
        } else {
          this.$set(this.answers, index, pos)
        }
      }
    },
    checkChoose: function (index, choose) {
      return this.answers[index] === choose
    },

    checkRight: function (index) {
      return this.rights.indexOf(index) > -1
    },

    checkWrong: function (index) {
      return this.wrongs.indexOf(index) > -1
    },

    checkBlank: function (index) {
      return this.blanks.indexOf(index) > -1
    },

    checkException: function (index) {
      return this.exceptions.indexOf(index) > -1
    },

    showRight: function (index, choose) {
      return ((this.checkRight(index) && this.checkChoose(index, choose)) || (!this.checkRight(index) && choose === this.correctAnswers[index]))
    },

    showWrong: function (index, choose) {
      return (this.checkWrong(index) && this.checkChoose(index, choose))
    },

    showBlank: function (index, choose) {
      return (this.checkBlank(index) && choose !== this.correctAnswers[index])
    },

    showAnswer: function (index) {
      if (this.quickquiz.correctAnswers[index] !== null) {
        if (this.correctAnswers[index] !== null && this.correctAnswers[index] !== undefined) {
          this.$set(this.correctAnswers, index, null)
        } else {
          this.$set(this.correctAnswers, index, this.quickquiz.correctAnswers[index])
        }
      } else {
        window.alert('這題沒有設置答案')
      }
    },
    showOverlay: function (index, type) {
      this.overlay.on = index
      this.overlay.type = type
      if (type === 1) {
        this.drawQAChart(index)
      }
    },
    hideOverlay: function () {
      this.overlay.on = -1
      this.overlay.type = -1
    },
    showAnswers: function () {
      if (this.correctAnswers !== this.quickquiz.correctAnswers) {
        this.correctAnswers = this.quickquiz.correctAnswers
      } else {
        this.correctAnswers = _.times(this.quickquiz.questions.length, _.constant(null))
      }

      if (this.sampleMode) {
        this.checkQuestions()
      }
    },
    checkQuestions: function () {
      var self = this
      _(this.rights).forEach(function (value) {
        self.checks[value] = true
      })

      _(this.wrongs).forEach(function (value) {
        self.checks[value] = false
      })

      _(this.blanks).forEach(function (value) {
        self.checks[value] = false
      })
    },
    computeAccuracy: function () {
      if (this.quickquiz.finished) {
        var self = this
        let data = this.quickquiz.analysis.questions
        if (_.isArray(data)) {
          _.forEach(data, function (data, key) {
            self.accuracy[key] = (data[0] * 100 / (data[0] + data[1] + data[2] + data[3])).toFixed(2) + '%'
          })
        }
      }
    },
    getQuizScore: function (option) {
      let rightCount = this.rights.length
      let total = this.rights.length + this.blanks.length + this.wrongs.length
      if (option === 'percentage') {
        return (rightCount * 100 / total).toFixed(0)
      } else {
        return rightCount + '/' + total
      }
    },
    timeDifference: function (start, finish) {
      var ms
      if (_.isDate(start) && _.isDate(finish)) {
        ms = Math.abs(start - finish)
      } else {
        ms = Math.abs(new Date(start) - new Date(finish))
      }

      var min = (ms / 1000 / 60) << 0
      var sec = (ms / 1000) % 60 << 0

      return (min + '分' + sec + '秒')
    },
    drawQAChart: function (index, option) {
      if (qaChart !== null) {
        qaChart.destroy()
      }
      let qaChart_id = 'qaChart_' + index
      var ctx = document.getElementById(qaChart_id).getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      var data = {
        datasets: [{
          data: this.quickquiz.analysis.questions[index],
          backgroundColor: [
            '#4BC0C0',
            '#FF6384',
            '#FFCE56',
            '#E7E9ED'
          ],
          label: '數據' // for legend
        }],
        labels: [
          '正确',
          '错误',
          '留空',
          '例外'
        ]
      }

      qaChart = new Chart(ctx, {
        data: data,
        type: 'pie',
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
      qaChart.render(500, false)
    },
    listenForSocket: function () {
      console.log('listin for socket')
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
        socket.emit('request observe', {student_id: self.quizsample.student._id})
      })

      socket.on('response observe', function (data) {
        if (_.has(data, 'answers')) {
          self.answers = data.answers
        }
      })

      socket.on('question on fill', function (data) {
        if (_.has(data, 'answers')) {
          let difference = calAnswerDiff(data.type, data.answers, self.answers)
          if (_.isArray(difference) && difference.length === 1) {
            let text = '第' + (parseInt(_.keys(difference[0])) + 1) + '题 --> ' + posToChoiceLable(difference[0][_.keys(difference[0])])
            self.$showToast(text)
          }
          self.answers = data.answers
        }
      })
    },
    ...mapActions({
      setQuickquizID: 'setQuickquizID',
      setQuickquizStudents: 'setQuickquizStudents'
    })
  },
  data () {
    return {
      socket: {
        joined: false,
        authenticated: false
      },
      correctAnswers: [],
      accuracy: [],
      checks: [],
      answers: [],
      rights: [],
      wrongs: [],
      blanks: [],
      SQPanalysis: [], // [question_id: {}]
      validateURL: false,
      quickquiz: {},
      quizsample: {},
      sampleMode: true,
      observeMode: false,
      overlay: {
        on: -1,
        type: -1
      }
    }
  },
  computed: mapGetters({
    getQuickquizID: 'getQuickquizID',
    getQuickquizStudents: 'getQuickquizStudents'
  })
}
</script>
