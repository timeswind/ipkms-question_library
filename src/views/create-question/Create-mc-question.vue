<template>
  <div id="create-mc-question">
    <div>
      <mu-raised-button primary class="float-button" style="bottom: 80px" @click="questionInbox.show = true" :disabled="publishButton.disabled">
        <i class="material-icons">inbox</i> {{questionInbox.questions.length}}
      </mu-raised-button>
      <mu-raised-button label="發佈" primary class="float-button" @click="publishQuestion()" :disabled="publishButton.disabled" />
      <div class="body_wrapper">
        <card>
          <div slot="content" style="padding: 16px 16px 0 16px">
            <div class="flex-column">
              <div class="flex-row">
                <div class="flex-column flex-50">
                  <span class="field-title">科目</span>
                  <select :value="newQuestionState.subject" @input="newQuestionSubjectOnChange($event.target.value)">
                    <option v-for="subject in subjects" v-bind:value="subject.id">
                      {{ subject.name }}
                    </option>
                  </select>
                </div>
                <div class="set_difficulty flex-column flex-50">
                  <span class="field-title" style="margin-bottom:4px">難度</span>
                  <span class="flex-row">
                    <i v-for="n in 5" @click="newQuestionDifficultyOnChange(n)" :class="{'difficulty_status': newQuestionState.difficulty > (n - 1), 'material-icons': true}">star_rate</i>
                  </span>
                </div>
              </div>
              <div class="flex-row" style="padding-top: 25px;">
                <div class="flex-column flex-50">
                  <div style="margin-right: 10px;">
                    <span class="field-title">標籤</span>
                  </div>
                  <div class="flex-row flex-center flex-wrap">
                    <div class="q-tag" v-for="(tag, index) in newQuestionState.tags" v-on:click="removeTag(index)">{{tag}}</div>
                  </div>
                  <div style="position: relative;top: -6px">
                    <mu-text-field hintText="輸入標籤.回車" @keyup.enter.native="addTag()" v-model="tag" style="width:200px" />
                  </div>
                </div>
                <!-- <div class="flex-column flex-50">
                  <span class="field-title">語言</span>
                  <select v-model="newQuestion.language" v-on:change="setUserLanguage(newQuestion.language)">
                    <option v-for="language in languages" v-bind:value="language.id">
                      {{ language.name }}
                    </option>
                  </select>
                </div> -->
              </div>
            </div>
          </div>
        </card>
        <div class="flex-column" style="margin-bottom: 16px">
          <h5 style="margin-left:4px">編輯題目</h5>
          <div style="background:#ddd" class="flex-column">
            <mu-flat-button primary @click="editorPreview.image.show = !editorPreview.image.show"><i class="material-icons">photo</i>
              <span>添加圖片</span>
            </mu-flat-button>
          </div>
          <div v-show="editorPreview.image.show" style="border: 1px solid #3f51b5;padding:16px">
            <form v-on:change="readImg($event)">
              <input type="file" id="uploadedImg"/>
            </form>
            <div class="flex-column flex-center">
              <canvas ref="fabricprocess"  style="border: 1px dashed #3f51b5;padding: 0"></canvas>
              <mu-text-field hintText="圖片名字" v-model="editorPreview.image.label"></mu-text-field>
              <mu-flat-button primary @click="outputImg()"><i class="material-icons">photo</i> <span>上傳圖片</span></mu-flat-button>
            </div>
          </div>
          <div v-if="newQuestionState.images" style="text-align:center">
            <div v-for="image in newQuestionState.images">
              <div v-if="image.type === 'qiniu'">
                <img :src="'https://ofb183q1d.qnssl.com/' + image.data + '?imageMogr2/format/jpg/'"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-column">
          <card>
            <div slot="content">
              <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content="newQuestionState.delta" @text-change="(delta)=>{handleDeltaChange(delta, 'question')}"></quill>
            </div>
          </card>
        </div>

        <h5 style="margin-left:4px">編輯答案</h5>
        <p style="margin:0;text-align:center;color:#9E9E9E">點擊選項設定正確答案</p>
        <div id="mc_input_container">
          <div class="flex-row">
            <div class="flex-column flex-50">
              <div :class="{'hightlight-answer': newQuestionState.answers.indexOf('0') > -1, 'mc_select': true}" @click="updateMcCorrectAnswer(0)">A</div>
              <card>
                <div slot="content">
                  <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content="newQuestionState.choices[0]" @text-change="(delta)=>{handleDeltaChange(delta, 'choice', 0)}"></quill>
                </div>
              </card>
            </div>
            <div class="flex-column flex-50">
              <div :class="{'hightlight-answer': newQuestionState.answers.indexOf('1') > -1, 'mc_select': true}" @click="updateMcCorrectAnswer(1)">B</div>
              <card>
                <div slot="content">
                  <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content="newQuestionState.choices[1]" @text-change="(delta)=>{handleDeltaChange(delta, 'choice', 1)}"></quill>
                </div>
              </card>
            </div>
          </div>
          <div class="flex-row">
            <div class="flex-column flex-50">
              <div :class="{'hightlight-answer': newQuestionState.answers.indexOf('2') > -1, 'mc_select': true}" @click="updateMcCorrectAnswer(2)">C</div>
              <card>
                <div slot="content">
                  <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content="newQuestionState.choices[2]" @text-change="(delta)=>{handleDeltaChange(delta, 'choice', 2)}"></quill>
                </div>
              </card>
            </div>
            <div class="flex-column flex-50">
              <div :class="{'hightlight-answer': newQuestionState.answers.indexOf('3') > -1, 'mc_select': true}" @click="updateMcCorrectAnswer(3)">D</div>
              <card>
                <div slot="content">
                  <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content="newQuestionState.choices[3]" @text-change="(delta)=>{handleDeltaChange(delta, 'choice', 3)}"></quill>
                </div>
              </card>
            </div>
          </div>
        </div>
      </div>

      <div :class="{'show': questionInbox.show, 'flex-column': true, 'questions_inbox': true}">
        <div class="flex-row" style="margin-top: 26px;padding-left: 16px;cursor: pointer;padding-bottom: 15px;width: 100%;border-bottom: 1px solid #E0E0E0;">
          <i class="material-icons" @click="questionInbox.show = false">close</i>
          <span style="font-size: 20px;padding-top: 2px;padding-left: 16px;">創建題集記錄</span>
        </div>

        <div class="flex-column flex-center" style="margin: 8px 0;" id="getLatestQuestionsButton">
          <mu-raised-button label="獲取我最近創建的題目" primary @click="getLatestQuestionsCreatedByMe()"/>
        </div>

        <div class="flex-column" style="overflow-y: auto;margin-bottom:60px; flex: 1">
          <div class="question" v-for="q in questionInbox.questions" v-bind:key="q._id">
            <div v-if="q.delta">
              <div class="q-context" v-html="renderDelta(q.delta)"></div>
            </div>
            <div v-if="q.context">
              <div class="q-context" v-html="q.context"></div>
            </div>
            <div class="flex-row">
              <!-- <span style="color: #9E9E9E">{{q._id | timestamp}}</span> -->
              <span class="flex-row flex-center" style="color:#FFC107;margin-left:auto">{{q.difficulty}}<i class="material-icons" style="font-size: 18px">star</i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'fabric'
import { mapGetters, mapActions } from 'vuex'
import deltaRender from '../../modules/delta-render'
import Card from '../../components/reuseable/Card'

export default {
  mounted: function () {
    this.$nextTick(function () {
      if (this.newQuestionState.answers.length === 0) {
        this.setNewQuestionAnswers(['0'])
      }
      this.newQuestion.language = this.getUserLanguage
    })
  },
  components: {
    Card
  },
  methods: {
    updateMcCorrectAnswer (newCorrectAnswer) {
      let answers = [newCorrectAnswer.toString()]
      this.setNewQuestionAnswers(answers)
    },
    newQuestionDifficultyOnChange (newDifficulty) {
      this.setNewQuestionMeta({difficulty: newDifficulty})
    },
    newQuestionSubjectOnChange (newSubject) {
      this.setNewQuestionMeta({subject: newSubject})
    },
    handleDeltaChange (delta, source, index) {
      if (source === 'question') {
        this.setNewQuestionDelta(delta)
      } else if (source === 'choice') {
        this.setNewQuestionChoice({index, delta})
      }
    },
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    readImg: function (e) {
      let c = this.$refs.fabricprocess
      var canvas = c.fabric || new window.fabric.Canvas(c, { width: 600, height: 300 })
      if (!c.fabric) {
        c.fabric = canvas
      }
      var reader = new window.FileReader()
      reader.onload = function (event) {
        var imgObj = new window.Image()
        imgObj.src = event.target.result
        imgObj.onload = function () {
          canvas.forEachObject(function (o) {
            o.remove()
          })
          var image = new window.fabric.Image(imgObj)
          image.set({
            angle: 0,
            padding: 10,
            cornersize: 10,
            height: 160,
            width: imgObj.width * (160 / imgObj.height)
          })
          canvas.centerObject(image)
          canvas.add(image)
          canvas.renderAll()
        }
      }
      reader.readAsDataURL(e.target.files[0])
    },
    outputImg: function () {
      let c = this.$refs.fabricprocess
      let canvas = c.fabric
      this.$http.get('/api/qiniu/uptoken').then(function (response) {
        this.uploadImage(canvas.getObjects()[0].toDataURL(), response.data.uptoken)
      })
    },
    publishQuestion: function () {
      this.publishButton.disabled = true
      if (this.checkComplete()) {
        var newQuestionData = JSON.parse(JSON.stringify(this.newQuestionState))

        newQuestionData.delta = JSON.stringify(newQuestionData.delta.ops)
        newQuestionData.choices = newQuestionData.choices.map((choice) => {
          return JSON.stringify(choice.ops)
        })

        this.$http.post('/api/manage-question/questions', newQuestionData).then(function (response) {
          this.$showToast('發佈成功')
          this.publishButton.disabled = false
          this.resetNewQuestion()
          this.editorPreview = {
            image: {
              label: '',
              type: 'qiniu',
              data: '',
              show: false
            }
          }
          this.questionInbox.questions.push(response.data)
        }, function (response) {
          this.$showToast('發佈失敗')
          this.publishButton.disabled = false
          console.log(response)
        })
      } else {
        this.publishButton.disabled = false
        this.$showToast('信息不完整')
      }
    },
    checkComplete: function () {
      const { delta, choices } = this.newQuestionState
      let contentComplete = (delta.ops && delta.ops.length > 0)
      let answerComplete = (choices.length === 4) && (choices[0].ops && choices[0].ops.length > 0) && (choices[1].ops && choices[1].ops.length > 0) && (choices[2].ops && choices[2].ops.length > 0) && (choices[3].ops && choices[3].ops.length > 0)

      return (contentComplete && answerComplete)
    },
    addTag: function () {
      if (this.tag.trim() !== '') {
        if (this.newQuestionState.tags.indexOf(this.tag) === -1) {
          var newTags = JSON.parse(JSON.stringify(this.newQuestionState.tags))
          newTags.push(this.tag)
          this.setNewQuestionMeta({tags: newTags})
          this.tag = ''
        } else {
          this.tag = ''
        }
      }
    },
    removeTag: function (index) {
      var newTags = JSON.parse(JSON.stringify(this.newQuestionState.tags))
      newTags.splice(index, 1)
      this.setNewQuestionMeta({tags: newTags})
    },
    getLatestQuestionsCreatedByMe: function () {
      this.$http.get('/api/manage-question/mine').then(function (response) {
        document.getElementById('getLatestQuestionsButton').style.display = 'none'
        this.questionInbox.questions = response.data
      })
    },
    uploadImage: function (imageData, token) {
      imageData = imageData.split(',')[1]
      let uptoken = 'UpToken ' + token
      let c = this.$refs.fabricprocess
      var canvas = c.fabric
      canvas.forEachObject(function (o) {
        o.remove()
      })
      this.$http.post('https://upload.qiniu.com/putb64/-1', imageData, {headers: {'Content-Type': 'application/octet-stream', 'Authorization': uptoken}}).then(function (response) {
        console.log(response.data)
        this.editorPreview.image.data = response.data.key
        this.editorPreview.image.show = false
        let newImage = {
          type: this.editorPreview.image.type,
          data: response.data.key,
          label: this.editorPreview.image.label
        }
        var newImages = JSON.parse(JSON.stringify(this.newQuestionState.images))
        newImages.push(newImage)
        this.setNewQuestionImages(newImages)
      })
    },
    ...mapActions([
      'setUserLanguage',
      'setNewQuestionMeta',
      'setNewQuestionDelta',
      'setNewQuestionChoice',
      'setNewQuestionImages',
      'setNewQuestionAnswers',
      'resetNewQuestion'
    ])
  },
  data () {
    return {
      publishButton: {
        disabled: false
      },
      questionInbox: {
        questions: [],
        show: false
      },
      tag: '',
      newQuestion: {
        type: 'mc',
        subject: 'math',
        tags: [],
        tips: '',
        difficulty: 1,
        choices: ['', '', '', ''],
        images: [],
        answer: {
          mc: 0
        },
        delta: ''
      },
      editorPreview: {
        image: {
          label: '',
          type: 'qiniu',
          data: '',
          show: false
        },
        question: { ops: [] },
        answer: {
          mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      subjects: 'getSubjects',
      languages: 'getLanguages',
      getUserLanguage: 'getUserLanguage',
      newQuestionState: 'newQuestionState'
    })
  }
}
</script>
<style>
#create-mc-question .set_difficulty i {
  width: 24px;
  color: #aaa;
  cursor: pointer;
}

#create-mc-question .difficulty_status {
  color: #FFC107 !important
}

#create-mc-question .body_wrapper {
  max-width: 800px;
  margin:32px auto;
}

#create-mc-question .question_preview {
  padding: 8px;
  border-top:  1px solid #ccc;
  min-height: 43px;
  box-sizing: border-box;
}

#create-mc-question .question_preview, #create-mc-question .mc_content {
  box-sizing: border-box;
  cursor: text;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
#create-mc-question .mc_content p,  #create-mc-question .mc_content ol, #create-mc-question .question_preview p,  #create-mc-question .question_preview ol{
  margin: 0
}

#create-mc-question .toolbar_title {
  padding: 8px;
  margin: 0
}

#create-mc-question .mc_preview {
  display: inline-block;
  width: 100%
}

#create-mc-question .mc_label {
  padding: 16px;
}

#create-mc-question .mc_content {
  padding-bottom: 16px;
}

#create-mc-question .questions_inbox {
  position: fixed;
  right: -360px;
  top: 55px;
  background: #fff;
  width: 360px;
  box-shadow: 0 0 12px #aaa;
  height: 100%;
  transition: right 0.2s;
}

#create-mc-question .questions_inbox.show {
  right: 0;
}

#create-mc-question .questions_inbox .question {
  padding: 8px 16px;
  border-bottom: 1px solid #eee
}

#create-mc-question .mc_select {
  cursor: pointer;
  padding: 8px;
  background: #ddd;
}

#create-mc-question .hightlight-answer {
  background-color: #009688;
  color: #fff;
}

</style>
