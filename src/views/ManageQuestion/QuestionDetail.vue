<template>
  <div id="question-detail">
    <p style="margin: 8px 0;color: #9E9E9E; text-align:center">最後更新于 {{ question.updated_at | calendar}}</p>
    <div class="flex-column light-card">
      <div class="flex-row flex-center" style="padding: 16px 16px 0 16px">
        <div class="flex-column flex-50">
          <span class="field-title">科目 Subject</span>
          <select v-model="question.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="difficulty-box flex-column flex-50">
          <span class="field-title">難度 Difficulty</span>
          <span class="flex-row flex-baseline" style="margin-top: 8px">
            <i class="material-icons" v-for="n in 5" @click="modify('difficulty', null, (n - 1))" :class="{'difficulty-heighlight': question.difficulty > (n - 1)}">star_rate</i>
          </span>
        </div>
      </div>
      <div class="flex-column" style="padding: 16px 16px 16px 16px">
        <span class="field-title">標籤 Tags</span>
        <div class="flex-row flex-center flex-wrap" style="margin-top:8px">
          <div class="q-d-tag" v-for="(tag, index) in question.tags" @click="modify('tag', 'remove', index)">{{tag}}</div>
          <mu-text-field hintText="輸入標籤.回車" @keyup.enter.native="modify('tag', 'add', tag)" v-model="tag" style="width:200px"/>
        </div>
      </div>
    </div>
    <div class="flex-row" style="padding: 16px 0; justify-content: flex-end" v-if="edit.on">
      <mu-flat-button label="取消" @click="cancelUpdate()" v-show="edit.change" />
      <mu-raised-button label="修改" primary raised @click="updateInfo()" :disabled="!edit.change" />
    </div>

    <div v-if="question.type === 'mc'" class="light-card default-pending">
      <div class="q-d-info-wrapper">
        <span class="q-d-subject">{{question.subject | subject}}</span>
        <div class="q-d-difficulty">
          <i class="material-icons" v-for="i in getNumberArray(question.difficulty)">star_rate</i>
        </div>
      </div>
      <div v-if="question.content">
        <div v-html="renderDelta(question.content)"></div>
      </div>
      <div v-if="question.images">
        <div v-for="image in question.images">
          <div v-if="image.type === 'qiniu'">
            <img :src="'https://ofb183q1d.qnssl.com/' + image.data + '?imageMogr2/format/jpg/'"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="question.type === 'mc'" class="q-d-mc-wrapper flex-column">
      <div v-if="question.content">
        <mu-row>
          <mu-col width="100" tablet="100" desktop="100" v-for="(choice, index) in question.choices">
            <div :class="{'light-card default-pending flex-row': true}" @click="modify('rightAnswer', 'mc', index)">
              <mu-checkbox name="correctList" class="mc-choice-label" :value="choice.correct" :disabled="!edit.on" @input="(bool) => { handleCheckboxInput(index, bool) }"/>
              <div v-html="renderDelta(choice.content)"></div>
            </div>
          </mu-col>
        </mu-row>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import deltaRender from '../../modules/delta-render.js'
export default {
  data () {
    return {
      question: {},
      tempQuestion: {},
      edit: {
        on: false,
        change: false
      },
      tag: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (this.$route.params.question_id) {
        this.getQuestionDetail(this.$route.params.question_id)
      } else {
        this.answer.buttonDisable = true
      }
    })
  },
  methods: {
    handleCheckboxInput (index, bool) {
      this.question.choices[index].correct = bool
      this.edit.change = true
    },
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    getQuestionDetail: function (question_id) {
      let apiURL = '/api/manage-question/question/' + question_id
      this.$http.get(apiURL).then(function (response) {
        this.question = response.data
        this.tempQuestion = JSON.parse(JSON.stringify(response.data))
        if (this.question.createdBy && this.question.createdBy === 'self') {
          this.edit.on = true
        }
      }, function (response) {
        console.log(response)
      })
    },
    modify: function (type, option, data) {
      if (this.question.createdBy === 'self') {
        if (type === 'difficulty') {
          let newDifficulty = data + 1
          if (this.question.difficulty !== newDifficulty) {
            this.question.difficulty = data + 1
            this.edit.change = true
          }
        } else if (type === 'tag') {
          if (option === 'add' && data) {
            if (data.trim() !== '') {
              if (this.question.tags.indexOf(data) === -1) {
                this.edit.change = true
                this.question.tags.push(data)
                this.tag = ''
              } else {
                this.tag = ''
              }
            }
          } else if (option === 'remove' && data >= 0) {
            this.edit.change = true
            this.question.tags.splice(data, 1)
          }
        } else if (type === 'rightAnswer') {
          let answerType = option
          if (answerType === 'mc') {
            let newMcRightChoiceIndex = [data.toString()]
            if (this.question.answers !== newMcRightChoiceIndex) {
              this.question.answers = newMcRightChoiceIndex
              this.edit.change = true
            }
          }
        }
      }
    },
    updateInfo: function () {
      if (this.question.subject !== this.tempQuestion.subject || this.question.difficulty !== this.tempQuestion.difficulty || JSON.stringify(this.question.tags) !== JSON.stringify(this.tempQuestion.tags) || this.question.choices !== this.tempQuestion.choices) {
        let data = {
          subject: this.question.subject,
          difficulty: this.question.difficulty,
          tags: this.question.tags,
          choices: this.question.choices
        }
        let apiURL = '/api/manage-question/question/' + this.$route.params.question_id
        this.$http.put(apiURL, data).then(function (response) {
          this.$showToast('修改成功')
          this.edit.change = false
          this.question.updated_at = new Date()
          this.tempQuestion = JSON.parse(JSON.stringify(this.question))
        }, function (response) {
          if (response.data.message) {
            this.$showToast(response.data.message)
          } else {
            this.$showToast('操作失敗')
          }
        })
      }
    },
    cancelUpdate: function () {
      this.sheetshow = false
      this.question = JSON.parse(JSON.stringify(this.tempQuestion))
      this.edit.change = false
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  computed: {
    ...mapGetters({
      alphabet: 'getAlphabet',
      subjects: 'getSubjects'
    })
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
