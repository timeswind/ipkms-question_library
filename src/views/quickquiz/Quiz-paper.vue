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

#quiz-paper .title, #quiz-paper .question {
  margin: 4px 0
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
  margin:0
}

#quiz-paper .index-label {
  font-weight: bold;
  font-size: 20px;
  padding: 0;
}

#quiz-paper .question-body p,#quiz-paper .question-body div{
  font-size: 18px;
  padding-left: 16px;
}

#quiz-paper .accuracy {
  margin-top: 4px;
  color: #FF9800;
  padding: 0 4px;
  border: 1px solid;
}

#quiz-paper .choices {
  border-top:1px solid #eee;
}

#quiz-paper .choose {
  background-color: #3F51B5;
  color: #fff;
}

#quiz-paper .right {
  background-color: #009688;
  color: #fff;
}

#quiz-paper .wrong {
  background-color: #F44336;
  color: #fff;
}

#quiz-paper .choice {
  padding: 16px;
  align-items: baseline;
  cursor: pointer;
  outline: none;
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
</style>
<template>
  <div id="quiz-paper">
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mdl-button class="icon-left-button" raised primary @click="goBack()"><i class="material-icons">keyboard_arrow_left</i>返回</mdl-button>
        <mdl-button class="icon-left-button" raised accent @click="showAnswers()" style="margin-left:16px"><i class="material-icons" style="margin-right: 8px">visibility</i>顯示 / 隱藏答案</mdl-button>
      </div>

      <div class="second-wrapper">
        <div class="third-wrapper" v-if="quickquiz.title">
          <card>
            <div slot="in" class="flex-column">
              <span class="flex-row flex-center">
                <span class="title">{{quickquiz.title}}</span>
                <span class="time flex-row" style="margin-left:auto"><i class="material-icons">timer</i>{{quickquiz.time}}分鐘</span>
              </span>
              <span class="author">出卷人: {{quickquiz.createdBy.name}}</span>
            </div>
          </card>
          <div id="question-body">
            <card v-for="question in quickquiz.questions" track-by="_id" class="question">
              <div slot="in" class="flex-column">
                <span class="flex-row flex-baseline">
                  <div class="flex-column flex-center">
                    <span class="index-label">{{$index + 1}}</span>
                    <span class="accuracy">%</span>
                  </div>

                  <span class="question-body">{{{question.context}}}</span>
                  <mdl-button accent style="margin-left:auto" @click="showAnswer($index)" v-if="quickquiz.correctAnswers[$index]">
                    <span v-show="correctAnswers[$index]">隱藏答案</span>
                    <span v-else="!correctAnswers[$index]">顯示答案</span>
                  </mdl-button>
                </span>
              </div>
              <div slot="out-below" class="choices flex-column" style="width: 100%">
                <div class="flex-row">
                  <div class="choice choice-a flex-50 flex-row" :class="{'choose': checkChoose($index, 0), 'right': showRight($index, 0), 'wrong': showWrong($index, 0)}" @click="answerOnChoose($index, 0)">
                    <span class="choice-label">A</span>
                    <div>{{{question.choices[0]}}}</div>
                  </div>
                  <div class="choice choice-b flex-50 flex-row" :class="{'choose': checkChoose($index, 1), 'right': showRight($index, 1), 'wrong': showWrong($index, 1)}" @click="answerOnChoose($index, 1)">
                    <span class="choice-label">B</span>
                    <div>{{{question.choices[1]}}}</div>
                  </div>
                </div>
                <div class="flex-row">
                  <div class="choice choice-c flex-50 flex-row" :class="{'choose': checkChoose($index, 2), 'right': showRight($index, 2), 'wrong': showWrong($index, 2)}" @click="answerOnChoose($index, 2)">
                    <span class="choice-label">C</span>
                    <div>{{{question.choices[2]}}}</div>
                  </div>
                  <div class="choice choice-d flex-50 flex-row" :class="{'choose': checkChoose($index, 3), 'right': showRight($index, 3), 'wrong': showWrong($index, 3)}" @click="answerOnChoose($index, 3)">
                    <span class="choice-label">D</span>
                    <div>{{{question.choices[3]}}}</div>
                  </div>
                </div>
              </div>
            </card>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Card from '../../components/reuseable/Card'
export default {
  attached: function () {
    if (this.$route.params.quickquiz_id) {
      this.validateURL = true
      this.getQuickquizQuestions(this.$route.params.quickquiz_id)
    }
  },
  components: {
    Card
  },
  methods: {
    getQuickquizQuestions: function (id) {
      var apiURL = '/api/manage-quickquiz/quickquiz' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        console.log(response.data)
        this.quickquiz = response.data
        for (var i = 0; i < response.data.questions.length; i++) {
          this.correctAnswers.push(null)
          this.answers.push(null)
        }
        this.renderQuestions()
      }, function (response) {
        console.log(response.data)
      })
    },
    goBack: function () {
      window.history.back()
    },
    renderQuestions: function () {
      setTimeout(function renderQuestions () {
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
      if (this.answers[index] === pos) {
        this.answers[index] = null
        this.answers.$set(index, null)
      } else {
        this.answers.$set(index, pos)
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

    checkException: function (index) {
      return this.exceptions.indexOf(index) > -1
    },

    showRight: function (index, choose) {
      return ((this.checkRight(index) && this.checkChoose(index, choose)) || (!this.checkRight(index) && choose === this.correctAnswers[index]))
    },

    showWrong: function (index, choose) {
      return this.checkWrong(index) && this.checkChoose(index, choose)
    },
    showAnswer: function (index) {
      if (this.quickquiz.correctAnswers[index]) {
        if (this.correctAnswers[index]) {
          this.correctAnswers.$set(index, null)
        } else {
          this.correctAnswers.$set(index, this.quickquiz.correctAnswers[index])
        }
      } else {
        window.alert('這題沒有設置答案')
      }
    },
    showAnswers: function () {
      if (this.correctAnswers !== this.quickquiz.correctAnswers) {
        this.correctAnswers = this.quickquiz.correctAnswers
      } else {
        this.correctAnswers = []
        for (var i = 0; i < this.quickquiz.question.length; i++) {
          this.correctAnswers.push(null)
        }
      }
    }
  },
  filters: {

  },
  data () {
    return {
      correctAnswers: [],
      answers: [],
      rights: [],
      wrongs: [],
      exceptions: [],
      validateURL: false,
      quickquiz: {}
    }
  }
}
</script>
