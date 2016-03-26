<style>
.q-d-subject {
  float: left;
  padding: 4px 8px;
  color: #fff;
  background: #03A9F4;
  margin-right: 5px
}
.q-type {
  border-bottom: 2px solid #2196F3;
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
}

#secondary-panel {
  padding: 16px;
  border-bottom: 1px solid #ccc;
}

#question-detail #question-preview-container {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 20px
}

#question-detail #question-preview-container p {
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
    <sheet-pannel :sheetshow.sync="sheetshow">
      <div slot="sheet-button">
        <mdl-button primary raised slot="sheet-button" class="sheet-button" @click="sheetshow = true" v-show="!sheetshow">
          修改
        </mdl-button>
      </div>
      <div slot="sheet-zone">
        <div class="block">
          科目：
          <select v-model="details.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="difficulty-box flex">
          <span style="line-height:26px">難度：</span>
          <span>
            <i class="material-icons" @click="details.difficulty = 1" :class="{'difficulty-heighlight': details.difficulty > 0}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 2" :class="{'difficulty-heighlight': details.difficulty > 1}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 3" :class="{'difficulty-heighlight': details.difficulty > 2}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 4" :class="{'difficulty-heighlight': details.difficulty > 3}">star_rate</i>
            <i class="material-icons" @click="details.difficulty = 5" :class="{'difficulty-heighlight': details.difficulty > 4}">star_rate</i>
          </span>
        </div>

        <div class="flex" style="position:relative;top:-20px">
          <div v-show="details.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
            <span>標籤：</span>
            <span class="q-tag" @click="removeTag($index)" v-for="tag in details.tags" track-by="$index">{{tag}}</span>
          </div>
          <mdl-textfield label="輸入標籤.回車" @keyup.enter="addTag()" :value.sync="tag" style="width:200px"></mdl-textfield>
        </div>
        <div style="position:relative;top:-15px;left:-10px">
          <mdl-button primary accent raised class="sheet-button">
            提交修改
          </mdl-button>
          <mdl-button class="sheet-button" @click="sheetshow = false">
            取消
          </mdl-button>
        </div>
      </div>
    </sheet-pannel>
    <div id="question-preview-container">
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
      <mdl-button accent raised style="margin:8px 4px" @click="getQuestionAnswer()" v-show="!answer.get" :disabled="answer.buttonDisable">顯示答案</mdl-button>

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
import vmdl from 'vue-mdl'
import Vue from 'vue'
import sheetPannel from './reuseable/Sheet-pannel.vue'
import Card from './reuseable/Card'

vmdl.register(Vue, 'mdlButton')
vmdl.register(Vue, 'mdlTextfield')
vmdl.register(Vue, 'mdlSwitch')

var button = vmdl.components['mdlButton']
var textfield = vmdl.components['mdlTextfield']
var mdlSwitch = vmdl.components['mdlSwitch']

export default {
  ready: function () {
    this.getQuestionDetail()
  },
  components: {
    mdlButton: button,
    mdlTextfield: textfield,
    mdlSwitch: mdlSwitch,
    sheetPannel,
    Card
  },
  methods: {
    getQuestionDetail: function () {
      let data = {
        question_id: this.$route.params.question_id
      }
      let apiURL = '/api/manage-question/detail'
      this.$http.get(apiURL, data).then(function (response) {
        this.details = response.data
        this.renderQuestions()
      }, function (response) {
        console.log(response)
      })
    },
    getQuestionAnswer: function (choice) {
      this.answer.buttonDisable = true
      if (!this.answer.get) {
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
          this.choice = choice
        }, function (response) {
          console.log(response)
        })
      } else {
        this.choice = choice
      }
    },
    checkMc: function (choice) {
      this.getQuestionAnswer(choice)
    },
    renderQuestions: function () {
      setTimeout(function renderQuestions () {
        window.renderMathInElement(
          document.getElementById('question-preview-container'),
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }, 0)
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  data () {
    return {
      sheetshow: false,
      choice: Number,
      details: {
        tags: []
      },
      answer: {
        buttonDisable: false,
        get: false,
        mc: undefined,
        long: undefined
      }
    }
  }
}
</script>
