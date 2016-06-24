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
  margin: 0 8px 0 0;
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
.q-d-mc-wrapper .card {
  padding: 16px
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
    <div id="question-body">
      <p style="margin: 8px 0;color: #9E9E9E; text-align:center">最後更新于 {{ details.updated_at | calendar}}</p>

      <card>
        <div slot="content">
          <div class="flex-column">
            <div class="flex-row flex-center" style="padding: 16px 16px 0 16px">
              <div class="flex-column flex-50">
                <span class="field-title">科目 Subject</span>
                <select v-model="details.subject">
                  <option v-for="subject in subjects" v-bind:value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>
              <div class="difficulty-box flex-column flex-50">
                <span class="field-title">難度 Difficulty</span>
                <span class="flex-row flex-baseline" style="margin-top: 8px">
                  <i class="material-icons" v-for="1 in 5" @click="modify('difficulty', null, $index)" :class="{'difficulty-heighlight': details.difficulty > $index}">star_rate</i>
                </span>
              </div>
            </div>
            <div class="flex-column" style="padding: 16px 16px 16px 16px">
              <span class="field-title">標籤 Tags</span>
              <div class="flex-row flex-center flex-wrap" style="margin-top:8px">
                <span class="q-d-tag" @click="modify('tag', 'remove', $index)" v-for="tag in details.tags" track-by="$index">{{tag}}</span>
                <mdl-textfield label="輸入標籤.回車" @keyup.enter="modify('tag', 'add', edit.tag)" :value.sync="edit.tag" style="width:200px"></mdl-textfield>
              </div>
            </div>
          </div>
        </div>
      </card>
      <div class="flex-row" style="padding: 16px 0; justify-content: flex-end" v-if="edit.on">
        <mdl-button @click="cancelUpdate()" v-show="edit.change">
          取消
        </mdl-button>
        <mdl-button primary accent raised @click="updateInfo()" :disabled="!edit.change">
          修改
        </mdl-button>
      </div>

      <div v-if="details.type === 'mc'">
        <card>
          <div slot="content" style="padding:16px">
            <div class="q-d-info-wrapper">
              <span class="q-d-subject">{{details.subject | subject}}</span>
              <div class="q-d-difficulty">
                <i class="material-icons" v-for="i in getNumberArray(details.difficulty)" track-by="$index">star_rate</i>
              </div>
            </div>
            {{{details.context}}}
          </div>
        </card>
        <div v-if="details.type === 'mc'" class="q-d-mc-wrapper flex-column">
          <div class="flex-row">
            <card class="flex-50" :class="{'hightlight-answer': answer.mc === 0}"><div slot="content"><span class="mc-choice-label">A</span>{{{details.choices[0]}}}</div></card>
            <card class="flex-50" :class="{'hightlight-answer': answer.mc === 1}"><div slot="content"><span class="mc-choice-label">B</span>{{{details.choices[1]}}}</div></card>
          </div>
          <div class="flex-row">
            <card class="flex-50" :class="{'hightlight-answer': answer.mc === 2}"><div slot="content"><span class="mc-choice-label">C</span>{{{details.choices[2]}}}</div></card>
            <card class="flex-50" :class="{'hightlight-answer': answer.mc === 3}"><div slot="content"><span class="mc-choice-label">D</span>{{{details.choices[3]}}}</div></card>
          </div>
        </div>

        <card v-if="details.statistic">
          <div slot="content" style="padding:16px">
            {{{details.statistic | json}}}
          </div>
        </card>
      </div>

    </div>
  </div>
</template>

<script>
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
    Card
  },
  methods: {
    getQuestionDetail: function (question_id) {
      let apiURL = '/api/manage-question/question/' + question_id
      this.$http.get(apiURL).then(function (response) {
        this.details = response.data
        if (response.data.type === 'mc') {
          this.answer.mc = response.data.answer.mc
        }
        this.tempDetails = JSON.parse(JSON.stringify(response.data))
        if (this.details.createdBy && this.details.createdBy === 'self') {
          this.edit.on = true
        }
        this.renderQuestions()
      }, function (response) {
        console.log(response)
      })
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
    modify: function (type, option, data) {
      if (this.details.createdBy === 'self') {
        if (type === 'difficulty') {
          this.details.difficulty = data + 1
          this.edit.change = true
        } else if (type === 'tag') {
          if (option === 'add' && data) {
            if (data.trim() !== '') {
              if (this.details.tags.indexOf(data) === -1) {
                this.edit.change = true
                this.details.tags.push(data)
                this.edit.tag = ''
              } else {
                this.edit.tag = ''
              }
            }
          } else if (option === 'remove' && data >= 0) {
            this.edit.change = true
            this.details.tags.splice(data, 1)
          }
        }
      }
    },
    updateInfo: function () {
      if (this.details.subject !== this.tempDetails.subject || this.details.difficulty !== this.tempDetails.difficulty || JSON.stringify(this.details.tags) !== JSON.stringify(this.tempDetails.tags)) {
        let data = {
          subject: this.details.subject,
          difficulty: this.details.difficulty,
          tags: this.details.tags
        }
        let apiURL = '/api/manage-question/question/' + this.$route.params.question_id
        this.$http.put(apiURL, data).then(function (response) {
          this.$showToast('修改成功')
          this.edit.change = false
          this.details.updated_at = new Date()
          this.tempDetails = JSON.parse(JSON.stringify(this.details))
        }, function (response) {
          console.log(response)
        })
      }
    },
    cancelUpdate: function () {
      this.sheetshow = false
      this.details = JSON.parse(JSON.stringify(this.tempDetails))
      this.edit.change = false
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  data () {
    return {
      validateURL: false,
      choice: Number,
      details: {},
      tempDetails: {},
      answer: {
        mc: null
      },
      subjects: Subject.subjects,
      edit: {
        on: false,
        change: false,
        tag: ''
      }
    }
  }
}
</script>
