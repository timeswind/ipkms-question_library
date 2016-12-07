<template>
  <div id="question-detail">
    <p style="margin: 8px 0;color: #9E9E9E; text-align:center">最後更新于 {{ details.updated_at | calendar}}</p>
    <div class="flex-column light-card">
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
            <i class="material-icons" v-for="n in 5" @click="modify('difficulty', null, (n - 1))" :class="{'difficulty-heighlight': details.difficulty > (n - 1)}">star_rate</i>
          </span>
        </div>
      </div>
      <div class="flex-column" style="padding: 16px 16px 16px 16px">
        <span class="field-title">標籤 Tags</span>
        <div class="flex-row flex-center flex-wrap" style="margin-top:8px">
          <div class="q-d-tag" v-for="(tag, index) in details.tags" @click="modify('tag', 'remove', index)">{{tag}}</div>
          <mu-text-field hintText="輸入標籤.回車" @keyup.enter.native="modify('tag', 'add', edit.tag)" v-model="edit.tag" style="width:200px"/>
        </div>
      </div>
    </div>
    <div class="flex-row" style="padding: 16px 0; justify-content: flex-end" v-if="edit.on">
      <mu-flat-button label="取消" @click="cancelUpdate()" v-show="edit.change" />
      <mu-raised-button label="修改" primary raised @click="updateInfo()" :disabled="!edit.change" />
    </div>

    <div v-if="details.type === 'mc'" class="light-card default-pending">
      <div class="q-d-info-wrapper">
        <span class="q-d-subject">{{details.subject | subject}}</span>
        <div class="q-d-difficulty">
          <i class="material-icons" v-for="i in getNumberArray(details.difficulty)">star_rate</i>
        </div>
      </div>
      <div v-if="details.delta">
        <div v-html="renderDelta(details.delta)"></div>
      </div>
      <div v-if="details.context">
        <div v-html="details.context"></div>
      </div>
      <div v-if="details.images">
        <div v-for="image in details.images">
          <div v-if="image.type === 'qiniu'">
            <img :src="'https://ofb183q1d.qnssl.com/' + image.data + '?imageMogr2/format/jpg/'"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="details.type === 'mc'" class="q-d-mc-wrapper flex-column">
      <div v-if="details.delta">
        <mu-row>
          <mu-col width="100" tablet="50" desktop="50" v-for="(choice, index) in details.choices">
            <div :class="{'hightlight-answer': details.answers.indexOf(index.toString()) > -1, 'light-card default-pending': true}" @click="modify('rightAnswer', 'mc', index)">
              <span class="mc-choice-label">{{alphabet[index]}}</span>
              <div v-html="renderDelta(details.choices[index])"></div>
            </div>
          </mu-col>
        </mu-row>
      </div>
    </div>
    <div class="light-card default-pending">
      {{details.statistic}}
    </div>
  </div>
</div>
</template>

<script>
import Subject from '../../modules/Subjects'
import deltaRender from '../../modules/delta-render.js'

export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.params.question_id) {
        this.validateURL = true
        this.getQuestionDetail(this.$route.params.question_id)
      } else {
        this.answer.buttonDisable = true
      }
    })
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    getQuestionDetail: function (question_id) {
      let apiURL = '/api/manage-question/question/' + question_id
      this.$http.get(apiURL).then(function (response) {
        this.details = response.data
        if (response.data.delta && response.data.delta !== '') {

        } else {
          this.renderQuestions()
        }
        this.tempDetails = JSON.parse(JSON.stringify(response.data))
        if (this.details.createdBy && this.details.createdBy === 'self') {
          this.edit.on = true
        }
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
          let newDifficulty = data + 1
          if (this.details.difficulty !== newDifficulty) {
            this.details.difficulty = data + 1
            this.edit.change = true
          }
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
        } else if (type === 'rightAnswer') {
          let answerType = option
          if (answerType === 'mc') {
            let newMcRightChoiceIndex = [data.toString()]
            if (this.details.answers !== newMcRightChoiceIndex) {
              this.details.answers = newMcRightChoiceIndex
              this.edit.change = true
            }
          }
        }
      }
    },
    updateInfo: function () {
      if (this.details.subject !== this.tempDetails.subject || this.details.difficulty !== this.tempDetails.difficulty || JSON.stringify(this.details.tags) !== JSON.stringify(this.tempDetails.tags) || this.details.answers !== this.tempDetails.answers) {
        let data = {
          subject: this.details.subject,
          difficulty: this.details.difficulty,
          tags: this.details.tags,
          answers: this.details.answers
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
      subjects: Subject.subjects,
      edit: {
        on: false,
        change: false,
        tag: ''
      }
    }
  },
  computed: {
    alphabet () {
      return this.$store.getters.getAlphabet
    }
  }
}
</script>
<style scoped>
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

#question-detail {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 8px
}

#question-detail p {
  margin: 0
}

.q-d-info-wrapper {
  margin-bottom: 10px
}
.q-d-mc-wrapper .card {
  padding: 16px
}

.q-d-mc-wrapper .hightlight-answer {
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
