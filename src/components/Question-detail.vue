<style>
.q-d-subject {
  float: left;
  padding: 4px 8px;
  color: #fff;
  background: #03A9F4;
  margin-right: 5px
}
.q-d-context {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  padding-left: 12px;
  border-left: 4px solid #3F51B5;
  margin-top: 20px
}
.q-d-public {
  color: #E91E63;
  float: right;
  padding: 8px;
}
.q-d-difficulty {
  float: none;
}
.q-d-difficulty i {
  width: 24px;
  color: #FFC107
}
.q-d-tag {
  color: #E91E63;
  margin: 0 5px;
  padding: 2px 4px;
  border: 1px solid #e91e63;
  cursor: pointer;
}

#question-detail #question-body {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 8px
}

#question-detail #question-body p {
  margin: 0
}

.q-d-info-wrapper {
  margin-bottom: 10px
}
.q-d-mc-wrapper .half {
  width: 50%;
  float: left;
  cursor: pointer;
}

.q-d-mc-wrapper .hightlight-answer .card {
  background-color: #009688;
  color: #fff
}

.q-d-mc-wrapper .wrong .card {
  background-color: #F44336;
  color: #fff
}

.q-d-mc-wrapper .mc-choice-label {
  font-size: 20px;
  color: #607D8B;
  float: left;
  line-height: 25px;
  padding-right: 10px;
}

.q-d-mc-wrapper .hightlight-answer .mc-choice-label {
  color: #fff
}

.q-d-mc-wrapper .wrong .mc-choice-label {
  color: #fff
}

.difficulty-box {
  padding: 10px 0
}
.difficulty-box i {
  width: 24px;
  color: #aaa;
  cursor: pointer;
}

.difficulty-heighlight{
  color: #FFC107 !important
}

</style>
<template>
  <div id="question-detail">
    <sheet-pannel :sheetshow.sync="sheetshow" :center="true">
      <div slot="sheet-button">
        <mdl-button primary raised slot="sheet-button" class="sheet-button" @click="sheetshow = true" v-show="!sheetshow && edit.button" :disabled="!edit.button">
          修改題目信息
        </mdl-button>
      </div>
      <div slot="button-subtitle">
        <p style="margin: 8px 0 0 0;color: #9E9E9E">最後更新于 {{ details.updated_at | date 'YYYY[年]M[月]DD[日] h:mm a'}}</p>
      </div>
      <div slot="sheet-zone">
        <div class="flex-row flex-center">
          <span>科目：</span>
          <select v-model="details.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="difficulty-box flex-row flex-center">
          <span style="line-height:26px">難度：</span>
          <span class="flex-row flex-baseline">
            <i class="material-icons" @click="details.difficulty = 1" :class="{'difficulty-heighlight': details.difficulty > 0}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 2" :class="{'difficulty-heighlight': details.difficulty > 1}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 3" :class="{'difficulty-heighlight': details.difficulty > 2}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 4" :class="{'difficulty-heighlight': details.difficulty > 3}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 5" :class="{'difficulty-heighlight': details.difficulty > 4}">star_rate</i>
          </span>
        </div>

        <div class="flex" style="position:relative;top:-20px">
          <div v-show="details.tags && details.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
            <span>標籤：</span>
            <span class="q-d-tag" @click="tags('remove', null, $index)" v-for="tag in details.tags" track-by="$index">{{tag}}</span>
          </div>
          <mdl-textfield label="輸入標籤.回車" @keyup.enter="tags('add', edit.tag)" :value.sync="edit.tag" style="width:200px"></mdl-textfield>
        </div>
        <div style="position:relative;top:-15px;left:-10px">
          <mdl-button primary accent raised class="sheet-button" @click="updateInfo()">
            提交修改
          </mdl-button>
          <mdl-button class="sheet-button" @click="cancelUpdate()">
            取消
          </mdl-button>
        </div>
      </div>
    </sheet-pannel>
    <div id="question-body">
      <mdl-button accent raised style="margin:0 0 8px 0" @click="getQuestionAnswer()" v-show="!answer.get" :disabled="answer.buttonDisable">顯示答案</mdl-button>
      <card>
        <div slot="in">
          <div class="q-d-info-wrapper">
            <span class="q-d-subject">{{details.subject | subject}}</span>
            <div class="q-d-difficulty">
              <i class="material-icons" v-for="i in getNumberArray(details.difficulty)" track-by="$index">star_rate</i>
            </div>
          </div>
          {{{details.context}}}
        </div>
      </card>
      <div v-if="details.type === 'mc'" class="q-d-mc-wrapper">
        <card class="half" :class="{'hightlight-answer': answer.mc === 0, 'wrong': answer.mc !== 0 && choice === 0}" @click="checkMc(0)"><div slot="in"><span class="mc-choice-label">A</span>{{{details.choices[0]}}}</div></card>
        <card class="half" :class="{'hightlight-answer': answer.mc === 1, 'wrong': answer.mc !== 1 && choice === 1}" @click="checkMc(1)"><div slot="in"><span class="mc-choice-label">B</span>{{{details.choices[1]}}}</div></card>
        <card class="half" :class="{'hightlight-answer': answer.mc === 2, 'wrong': answer.mc !== 2 && choice === 2}" @click="checkMc(2)"><div slot="in"><span class="mc-choice-label">C</span>{{{details.choices[2]}}}</div></card>
        <card class="half" :class="{'hightlight-answer': answer.mc === 3, 'wrong': answer.mc !== 3 && choice === 3}" @click="checkMc(3)"><div slot="in"><span class="mc-choice-label">D</span>{{{details.choices[3]}}}</div></card>
      </div>
    </div>
  </div>
</template>

<script>
import sheetPannel from './reuseable/Sheet-pannel.vue'
import Card from './reuseable/Card'
import Subject from '../modules/Subjects'

export default {
  ready: function () {
    if (this.$route.params.question_id) {
      this.validateURL = true
      this.getQuestionDetail(this.$route.params.question_id)
    } else {
      this.answer.buttonDisable = true
    }
  },
  components: {
    sheetPannel,
    Card
  },
  methods: {
    getQuestionDetail: function (question_id) {
      let apiURL = '/api/manage-question/question/' + question_id
      this.$http.get(apiURL).then(function (response) {
        this.details = response.data
        this.tempDetails = JSON.parse(JSON.stringify(response.data))
        if (this.details.createdBy && this.details.createdBy === 'self') {
          this.edit.button = true
        }
        this.renderQuestions()
      }, function (response) {
        console.log(response)
      })
    },
    getQuestionAnswer: function (choice) {
      this.answer.buttonDisable = true
      if (!this.answer.get && this.validateURL) {
        let data = {
          question_id: this.$route.params.question_id
        }
        let apiURL = '/api/manage-question/answer'
        this.$http.get(apiURL, data).then(function (response) {
          if (this.details.type === 'mc') {
            this.answer.mc = response.data.mc
          } else {
            this.answer.long = response.data.long
          }
          this.answer.get = true

          if (choice) {
            this.choice = choice
          }
        }, function (response) {
          console.log(response)
        })
      } else {
        if (choice) {
          this.choice = choice
        }
      }
    },
    checkMc: function (choice) {
      this.getQuestionAnswer(choice)
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
    tags: function (option, tag, index) {
      if (option === 'add' && tag) {
        if (tag.trim() !== '') {
          this.details.tags.push(tag)
          this.edit.tag = ''
        }
      } else if (option === 'remove' && index >= 0) {
        this.details.tags.splice(index, 1)
      }
    },
    updateInfo: function () {
      if (this.details.subject !== this.tempDetails.subject || this.details.difficulty !== this.tempDetails.difficulty || JSON.stringify(this.details.tags) !== JSON.stringify(this.tempDetails.tags)) {
        let data = {
          subject: this.details.subject,
          difficulty: this.details.difficulty,
          tags: this.details.tags,
          updated_at: new Date()
        }
        let apiURL = '/api/manage-question/question/' + this.$route.params.question_id
        this.$http.put(apiURL, data).then(function (response) {
          this.sheetshow = false
          this.details.updated_at = new Date()
          this.tempDetails.updated_at = new Date()
        }, function (response) {
          console.log(response)
        })
      }
    },
    cancelUpdate: function () {
      this.sheetshow = false
      this.details = JSON.parse(JSON.stringify(this.tempDetails))
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  data () {
    return {
      validateURL: false,
      sheetshow: false,
      choice: Number,
      details: {},
      tempDetails: {},
      answer: {
        buttonDisable: false,
        get: false,
        mc: undefined,
        long: undefined
      },
      subjects: Subject.subjects,
      edit: {
        button: false,
        tag: ''
      }
    }
  }
}
</script>
