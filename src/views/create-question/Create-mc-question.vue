<template>
  <div id="create-mc-question">
    <mdl-button primary raised class="float-button" style="bottom: 80px" @click="questionInbox.show = true" v-bind:disabled="publishButton.disabled">
      <i class="material-icons">inbox</i> {{questionInbox.questions.length}}
    </mdl-button>
    <mdl-button primary raised class="float-button" @click="publishQuestion()" v-bind:disabled="publishButton.disabled">
      發佈
    </mdl-button>
    <div class="body_wrapper">
      <card>
        <div slot="content" style="padding: 16px 16px 0 16px">
          <div class="flex-column">
            <div class="flex-row">
              <div class="flex-column flex-50">
                <span class="field-title">科目</span>
                <select v-model="newQuestion.subject">
                  <option v-for="subject in subjects" v-bind:value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>
              <div class="set_difficulty flex-column flex-50">
                <span class="field-title" style="margin-bottom:4px">難度</span>
                <span class="flex-row">
                  <i v-for="n in 5" class="material-icons" @click="newQuestion.difficulty = $index + 1" :class="{'difficulty_status': newQuestion.difficulty > $index}">star_rate</i>
                </span>
              </div>
            </div>
            <div class="flex-row" style="padding-top: 25px;">
              <div class="flex-column flex-50">
                <div style="margin-right: 10px;">
                  <span class="field-title">標籤</span>
                </div>
                <div class="flex-row flex-center flex-wrap">
                  <span class="q-tag" @click="removeTag($index)" v-for="tag in newQuestion.tags" track-by="$index">{{tag}}</span>
                </div>
                <div style="position: relative;top: -12px">
                  <mdl-textfield label="輸入標籤.回車" @keyup.enter="addTag()" :value.sync="tag" style="width:200px"></mdl-textfield>
                </div>
              </div>

              <div class="flex-column flex-50">
                <span class="field-title">語言</span>
                <select v-model="newQuestion.language" v-on:change="setUserLanguage(newQuestion.language)">
                  <option v-for="language in languages" v-bind:value="language.id">
                    {{ language.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </card>
      <div class="flex-column" style="margin-bottom: 16px">
        <h5 style="margin-left:4px">編輯題目</h5>
        <div style="background:#ddd" class="flex-column">
          <mdl-button primary @click="editorPreview.image.show = !editorPreview.image.show"><i class="material-icons">photo</i>
            <span>添加圖片</span>
          </mdl-button>
        </div>
        <div v-show="editorPreview.image.show" style="border: 1px solid #3f51b5;padding:16px">
          <form v-on:change="readImg($event)">
            <input type="file" id="uploadedImg"/>
          </form>
          <div class="flex-column flex-center">
            <canvas v-el:fabricprocess  style="border: 1px dashed #3f51b5;padding: 0"></canvas>
            <mdl-textfield label="圖片名字" :value.sync="editorPreview.image.label"></mdl-textfield>
            <mdl-button primary @click="outputImg()"><i class="material-icons">photo</i> <span>上傳圖片</span></mdl-button>
          </div>
        </div>
        <div v-if="newQuestion.images" style="text-align:center">
          <div v-for="image in newQuestion.images" track-by="$index">
            <div v-if="image.type === 'qiniu'">
              <img :src="'http://obmooknfq.bkt.clouddn.com/' + image.data + '?imageMogr2/format/jpg/'"/>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-column">
        <card>
          <div slot="content">
            <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content.sync="editorPreview.question"></quill>
          </div>
        </card>
      </div>

      <h5 style="margin-left:4px">編輯答案</h5>
      <p style="margin:0;text-align:center;color:#9E9E9E">點擊選項設定正確答案</p>
      <div id="mc_input_container">
        <div class="flex-row">
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 0}" @click="newQuestion.answer.mc = 0">A</div>
            <card>
              <div slot="content">
                <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content.sync="editorPreview.answer.mc[0]"></quill>
              </div>
            </card>
          </div>
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 1}" @click="newQuestion.answer.mc = 1">B</div>
            <card>
              <div slot="content">
                <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content.sync="editorPreview.answer.mc[1]"></quill>
              </div>
            </card>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 2}" @click="newQuestion.answer.mc = 2">C</div>
            <card>
              <div slot="content">
                <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content.sync="editorPreview.answer.mc[2]"></quill>
              </div>
            </card>
          </div>
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 3}" @click="newQuestion.answer.mc = 3">D</div>
            <card>
              <div slot="content">
                <quill :toolbar="['italic', 'underline', { 'list': 'ordered'}, { 'list': 'bullet' }]" :content.sync="editorPreview.answer.mc[3]"></quill>
              </div>
            </card>
          </div>
        </div>
      </div>
    </div>

    <div class="questions_inbox" class="flex-column" :class="{'show': questionInbox.show}">
      <div class="flex-row" style="margin-top: 26px;padding-left: 16px;cursor: pointer;padding-bottom: 15px;width: 100%;border-bottom: 1px solid #E0E0E0;">
        <i class="material-icons" @click="questionInbox.show = false">close</i>
        <span style="font-size: 20px;padding-top: 2px;padding-left: 16px;">創建題集記錄</span>
      </div>

      <div class="flex-column flex-center" style="margin: 8px 0;" id="getLatestQuestionsButton">
        <mdl-button primary raised @click="getLatestQuestionsCreatedByMe()">獲取我最近創建的題目</mdl-button>
      </div>

      <div class="flex-column" style="overflow-y: auto;margin-bottom:60px; flex: 1">
        <div class="question" v-for="q in questionInbox.questions" track-by="_id">
          <div v-if="q.delta">
            <div class="q-context" v-html="renderDelta(q.delta)"></div>
          </div>
          <div v-if="q.context">
            <div class="q-context" v-html="q.context"></div>
          </div>
          <div class="flex-row">
            <span style="color: #9E9E9E">{{q._id | timestamp}}</span>
            <span class="flex-row flex-center" style="color:#FFC107;margin-left:auto">{{q.difficulty}}<i class="material-icons" style="font-size: 18px">star</i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'fabric'
import deltaRender from '../../modules/delta-render'
import Subject from '../../modules/Subjects'
import Language from '../../modules/Languages'
import Card from '../../components/reuseable/Card'
import store from '../../vuex/store'
import { setUserLanguage } from '../../vuex/actions'
import { getUserLanguage } from '../../vuex/getters'
import 'quill/dist/quill.snow.css'
// var delayTimer

export default {
  ready: function () {
    this.newQuestion.language = this.getUserLanguage
  },
  components: {
    Subject,
    Card
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    readImg: function (e) {
      let c = this.$els.fabricprocess
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
      let c = this.$els.fabricprocess
      let canvas = c.fabric
      this.$http.get('/api/qiniu/uptoken').then(function (response) {
        this.uploadImage(canvas.getObjects()[0].toDataURL(), response.data.uptoken)
      })
    },
    publishQuestion: function () {
      this.publishButton.disabled = true
      if (this.checkComplete()) {
        // this.newQuestion.context = renderQuill(this.editorPreview.question.ops)
        this.newQuestion.delta = JSON.stringify(this.editorPreview.question.ops)
        // this.newQuestion.choices[0] = renderQuill(this.editorPreview.answer.mc[0].ops)
        // this.newQuestion.choices[1] = renderQuill(this.editorPreview.answer.mc[1].ops)
        // this.newQuestion.choices[2] = renderQuill(this.editorPreview.answer.mc[2].ops)
        // this.newQuestion.choices[3] = renderQuill(this.editorPreview.answer.mc[3].ops)
        this.newQuestion.choices[0] = JSON.stringify(this.editorPreview.answer.mc[0].ops)
        this.newQuestion.choices[1] = JSON.stringify(this.editorPreview.answer.mc[1].ops)
        this.newQuestion.choices[2] = JSON.stringify(this.editorPreview.answer.mc[2].ops)
        this.newQuestion.choices[3] = JSON.stringify(this.editorPreview.answer.mc[3].ops)

        this.$http.post('/api/manage-question/questions', this.newQuestion).then(function (response) {
          this.$showToast('發佈成功')
          this.publishButton.disabled = false
          this.newQuestion.context = ''
          this.newQuestion.choices = ['', '', '', '']
          this.newQuestion.images = []
          this.newQuestion.answer = {
            mc: 1
          }
          this.editorPreview = {
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
          this.$broadcast('clear-editor')
          // this.renderQuestionPreview('clear')
          // this.renderMcPreview('clear')
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
      let contentComplete = this.editorPreview.question.ops.length !== 0
      let answerComplete = this.editorPreview.answer.mc[0].ops.length !== 0 && this.editorPreview.answer.mc[1].ops.length !== 0 && this.editorPreview.answer.mc[2].ops.length !== 0 && this.editorPreview.answer.mc[3].ops.length !== 0

      return (contentComplete && answerComplete)
    },
    addTag: function () {
      if (this.tag.trim() !== '') {
        if (this.newQuestion.tags.indexOf(this.tag) === -1) {
          this.newQuestion.tags.push(this.tag)
          this.tag = ''
        } else {
          this.tag = ''
        }
      }
    },
    removeTag: function (index) {
      this.newQuestion.tags.splice(index, 1)
    },
    // renderQuestionPreview: function (option) {
    // if (option === 'clear') {
    //   window.document.querySelector('.question_preview').innerHTML = '<p></p>'
    // } else {
    //   window.document.querySelector('.question_preview').innerHTML = renderQuill(this.editorPreview.question.ops)
    //   setTimeout(function renderQuestionPreview () {
    //     window.renderMathInElement(
    //       document.querySelector('.question_preview'),
    //       {
    //         delimiters: [
    //           {left: '$$', right: '$$', display: false}
    //         ]
    //       }
    //     )
    //   }, 0)
    // }
    // },
    // renderMcPreview: function (option) {
    //   if (option === 'clear') {
    //     window.document.getElementById('mc1').innerHTML = '<p></p>'
    //     window.document.getElementById('mc2').innerHTML = '<p></p>'
    //     window.document.getElementById('mc3').innerHTML = '<p></p>'
    //     window.document.getElementById('mc4').innerHTML = '<p></p>'
    //   } else {
    //     window.document.getElementById('mc1').innerHTML = renderQuill(this.editorPreview.answer.mc[0].ops)
    //     window.document.getElementById('mc2').innerHTML = renderQuill(this.editorPreview.answer.mc[1].ops)
    //     window.document.getElementById('mc3').innerHTML = renderQuill(this.editorPreview.answer.mc[2].ops)
    //     window.document.getElementById('mc4').innerHTML = renderQuill(this.editorPreview.answer.mc[3].ops)
    //
    //     setTimeout(function renderMcPreview () {
    //       window.renderMathInElement(
    //         document.getElementById('mc_preview'),
    //         {
    //           delimiters: [
    //             {left: '$$', right: '$$', display: false}
    //           ]
    //         }
    //       )
    //     }, 0)
    //   }
    // },
    getLatestQuestionsCreatedByMe: function () {
      this.$http.get('/api/manage-question/mine').then(function (response) {
        document.getElementById('getLatestQuestionsButton').style.display = 'none'
        this.questionInbox.questions = response.data
      })
    },
    uploadImage: function (imageData, token) {
      imageData = imageData.split(',')[1]
      let uptoken = 'UpToken ' + token
      let c = this.$els.fabricprocess
      var canvas = c.fabric
      canvas.forEachObject(function (o) {
        o.remove()
      })
      this.$http.post('http://upload.qiniu.com/putb64/-1', imageData, {headers: {'Content-Type': 'application/octet-stream', 'Authorization': uptoken}}).then(function (response) {
        console.log(response.data)
        this.editorPreview.image.data = response.data.key
        this.editorPreview.image.show = false
        let newImage = {
          type: this.editorPreview.image.type,
          data: response.data.key,
          label: this.editorPreview.image.label
        }
        this.newQuestion.images.push(newImage)
      })
    }
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
      subjects: Subject.subjects,
      languages: Language.languages,
      tag: '',
      newQuestion: {
        language: '',
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
  filters: {
    'timestamp': function (input) {
      return this.$options.filters.calendar(new Date(parseInt(input.toString().substring(0, 8), 16) * 1000), '')
    }
  },
  // watch: {
  //   'editorPreview.question.ops': function () {
  //   var self = this
  //   clearTimeout(delayTimer)
  //   delayTimer = setTimeout(function () {
  //     self.renderQuestionPreview()
  //   }, 500)
  //   },
  //   'editorPreview.answer.mc': function () {
  //     var self = this
  //     clearTimeout(delayTimer)
  //     delayTimer = setTimeout(function () {
  //       self.renderMcPreview()
  //     }, 500)
  //   }
  // },
  store,
  vuex: {
    actions: {
      setUserLanguage: setUserLanguage
    },
    getters: {
      getUserLanguage: getUserLanguage
    }
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
