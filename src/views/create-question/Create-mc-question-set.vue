<style>
#create-mc-question-set .newquestion-difficulty-box {
  padding: 10px 0
}

#create-mc-question-set .newquestion-difficulty-box i {
  width: 24px;
  color: #aaa;
  cursor: pointer;
}

#create-mc-question-set .difficulty-heighlight{
  color: #FFC107 !important
}

#create-mc-question-set .q-tag {
  color: #E91E63;
  margin:8px 4px 0 0;
  padding: 2px 4px;
  border: 1px solid #e91e63;
  cursor: pointer;
}

#create-mc-question-set .body-wrapper {
  max-width: 800px;
  margin:32px auto;
}

#question-preview-container {
  padding: 8px;
  border-top:  1px solid #ccc;
  min-height: 43px;
  box-sizing: border-box;
}

#question-preview-container p, #mc1 p, #mc2 p, #mc3 p, #mc4 p {
  margin: 0;
  line-height: 20px
}

#question-preview-container ul, #mc1 ul, #mc2 ul, #mc3 ul, #mc4 ul {
  margin: 0;
  line-height: 20px
}

#create-mc-question-set .toolbar-title {
  padding: 8px;
  margin: 0
}
#create-mc-question-set .mc-input-wrapper,.mc-preview-wrapper {
  display: inline-block;
  width: 100%
}
#create-mc-question-set .mc_select {
  cursor: pointer;
  padding: 8px;
  background: #ddd;
}
#create-mc-question-set .hightlight-answer {
  background-color: #009688;
  color: #fff
}
#create-mc-question-set .mc-preview-wrapper .mc-label {
  height:52px;
  line-height:52px;
  padding: 0 16px;
}

#create-mc-question-set .create-qcollection-modal {
  display: block;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

#create-mc-question-set .modal-container {
  width: 300px;
  margin: 130px auto 0;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
}

#create-mc-question-set .qcollection-inbox {
  height: 60px;
  background: #fff;
  position: fixed;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 1px 3px #aaa;
  z-index: 8999;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: height 0.2s ease;
}

#create-mc-question-set .qcollection-inbox.show {
  height: calc(100% - 160px);
}

#create-mc-question-set .qcollection-inbox .expand-icon {
  position: absolute;
  background: #fff;
  bottom: -26px;
  right: 32px;
  padding: 0 16px;
  box-shadow: 0 3px 3px #aaa;
  cursor: pointer;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px
}

#create-mc-question-set .qcollection-inbox p {
  margin: 0
}

@media screen and (max-width: 1024px) {
  #create-mc-question-set .create-qcollection-modal {
    box-sizing: border-box;
  }
  #create-mc-question-set .qcollection-inbox {
    top: 56px;
    left: 0;
    right: 0;
  }
}

@media screen and (min-width: 1025px) {
  #create-mc-question-set .create-qcollection-modal {
    box-sizing: border-box;
    padding-left: 240px
  }
  #create-mc-question-set .qcollection-inbox {
    top: 64px;
    left: 240px;
    right: 0;
  }
}

#create-mc-question-set .qcollection-inbox .qcollection-header {
  max-width: 800px;
  padding: 16px 16px 0 16px;
  margin: 0 auto;
  margin-bottom: 16px
}
#create-mc-question-set .qcollection-inbox .qcollection-header .public {
  border: 1px solid;
  color: #E91E63;
  font-size: 14px;
  padding: 2px 4px;
}
#create-mc-question-set .qcollection-inbox .qcollection-header .subject {
  color: #fff;
  background: #03A9F4;
  font-size: 14px;
  padding: 2px 4px;
  margin-left: 8px;
  margin-right: 8px
}
#create-mc-question-set .qcollection-inbox .qcollection-header .name {
  font-size: 18px;
  font-weight: bold;
}
#create-mc-question-set .qcollection-inbox .questions {
  height:calc(100% - 70px);
  overflow:auto;
  border-top: 1px solid #eee;
}

#create-mc-question-set .qcollection-inbox .question {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
</style>
<template>
  <div id="create-mc-question-set" >
    <transition name="modal">
      <div class="create-qcollection-modal" v-show="!newQcollection.id">
        <div class="modal-container">
          <h3 class="mdl-typography--headline" style="margin:16px 0 8px 0;padding:16px 16px 0 16px">第一步：創建題集</h3>

          <div style="padding:0 16px 16px 16px" class="create-new-qcollection-form" v-show="newQcollection.myQcollections.length === 0">
            <mdl-button primary style="margin-left:-16px" @click.native="getMyQcollections()">或選擇現有題集</mdl-button>

            <div class="flex-column">
              <span class="field-title" style="position: relative; top: 16px">題集名字</span>
              <mu-text-field v-model="newQcollection.name"/>
            </div>
            <div class="flex-column">
              <span class="field-title">科目</span>
              <select v-model="newQcollection.subject" style="width: 100%">
                <option v-for="subject in subjects" v-bind:value="subject.id">
                  {{ subject.name }}
                </option>
              </select>
            </div>
            <div style="padding:20px 0">
              <mdl-checkbox :checked="newQcollection.public">公開</mdl-checkbox>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
              <mdl-button style="margin-left:auto;" @click.native="$goBack()">取消</mdl-button>
              <mdl-button primary raised style="margin-left:16px" @click.native="createNewQcollection()">創建</mdl-button>
            </div>
          </div>

          <div class="my-qcollections" v-show="newQcollection.myQcollections.length > 0" style="max-height:400px; overflow:auto;">
            <mdl-button primary style="padding-left:16px" @click.native="newQcollection.myQcollections = []">返回創建新題集</mdl-button>

            <div class="flex-column" @click.native="createNewQcollection('from exist', qc)" v-for="qc in newQcollection.myQcollections" v-bind:key="qc._id" style=" padding: 16px;border-bottom: 1px solid #eee;cursor:pointer">
              <div class="flex-row ">
                <span style="background: #2196F3;color: #fff;padding: 0px 8px;border-radius: 12px;margin-right: 4px;">{{qc.subject | subject}}</span>
                <span>{{qc.name}}</span>
              </div>

            </div>

            <div class="flex-column flex-center" style="margin:16px 0 32px 0">
              <mdl-button raised primary @click.native="nextPage()" :disabled="!newQcollection.loadMore">加載更多</mdl-button>
            </div>
          </div>

        </div>
      </div>
    </transition>

    <mdl-button accent raised class="float-button" @click.native="goToQCDetailView()" v-bind:disabled="publishButton.disabled">
      完成編輯
    </mdl-button>
    <div class="body-wrapper">

      <div class="qcollection-inbox" :class="{'show': qcollectionInbox.show}">

        <div class="qcollection-header flex-row flex-center">
          <span class="public">{{newQcollection.public | bTp}}</span>
          <span class="subject" v-if="newQcollection.subject">{{newQcollection.subject | subject}}</span>
          <span class="name">{{newQcollection.name}}</span>
          <span class="flex-row flex-center" style="margin-left:auto;font-size:18px;color:#2196F3"><i class="material-icons" style="font-size:24px;margin-right:8px">description</i> {{qcollectionInbox.questions.length}} 題</span>
        </div>

        <div class="flex-column questions" v-show="qcollectionInbox.show">
          <div class="flex-row flex-baseline flex-no-shrink question" v-for="(q, index) in qcollectionInbox.questions" v-bind:key="q._id">
            <span style="margin-right:8px">{{index + 1}}.</span>
            <div v-if="q.delta">
              <p class="q-context" v-html="renderDelta(q.delta)"></p>
            </div>
            <div v-if="q.context">
              <p class="q-context" v-html="q.context"></p>
            </div>
            <span class="flex-row flex-center" style="margin-left:auto;color:#FFC107">{{q.difficulty}}<i class="material-icons" style="font-size:16px">star</i></span>
          </div>
        </div>

        <div class="expand-icon" @click.native="toggleQCInbox()">
          <i class="material-icons" v-if="qcollectionInbox.show">expand_less</i>
          <i class="material-icons" v-else>expand_more</i>
        </div>
      </div>


      <div style="margin:16px 0;width:100%;height:16px">
      </div>
      <card>
        <div slot="content" style="padding: 16px 16px 0 16px">
          <div class="flex-column">
            <div class="flex-row">
              <div class="flex-column flex-50">
                <span class="field-title">語言</span>
                <select v-model="newQuestion.language" v-on:change="setUserLanguage(newQuestion.language)">
                  <option v-for="(language, index) in languages" v-bind:value="language.id">
                    {{ language.name }}
                  </option>
                </select>
              </div>
              <div class="newquestion-difficulty-box flex-column flex-50">
                <span class="field-title" style="margin-bottom:4px">難度</span>
                <span class="flex-row">
                  <i v-for="n in 5" class="material-icons" @click="newQuestion.difficulty = n" :class="{'difficulty-heighlight': newQuestion.difficulty > n}">star_rate</i>
                </span>
              </div>
            </div>
            <div class="flex-row" style="padding-top: 16px;">
              <div class="flex-column">
                <div style="margin-right: 10px;">
                  <span class="field-title">標籤</span>
                </div>
                <div class="flex-row flex-center flex-wrap">
                  <span class="q-tag" v-for="(tag, index) in newQuestion.tags" @click.native="removeTag(index)">{{tag}}</span>
                </div>
                <div style="position: relative;top: -12px">
                  <mu-text-field hintText="輸入標籤.回車" @keyup.enter.native="addTag()" v-model="tag" style="width:200px"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </card>

      <div class="flex-column">
        <card>
          <div slot="content">
            <quill :content="editorPreview.question"></quill>
          </div>
        </card>
      </div>
      <h5 style="margin-left:4px">編輯答案</h5>
      <p style="margin:0;text-align:center;color:#9E9E9E">點擊選項設定正確答案</p>

      <div>
        <p style="margin:0;text-align:center;color:#9E9E9E">答案選項輸入</p>
        <div class="flex-row">
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 0}" @click.native="newQuestion.answer.mc = 0">A</div>
            <card><div slot="content"><quill :content="editorPreview.answer.mc[0]"></quill></div></card>
          </div>
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 1}" @click.native="newQuestion.answer.mc = 1">B</div>
            <card><div slot="content"><quill :content="editorPreview.answer.mc[1]"></quill></div></card>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 2}" @click.native="newQuestion.answer.mc = 2">C</div>
            <card><div slot="content"><quill :content="editorPreview.answer.mc[2]"></quill></div></card>
          </div>
          <div class="flex-column flex-50">
            <div class="mc_select" :class="{'hightlight-answer': newQuestion.answer.mc === 3}" @click.native="newQuestion.answer.mc = 3">D</div>
            <card><div slot="content"><quill :content="editorPreview.answer.mc[3]"></quill></div></card>
          </div>
        </div>
      </div>
      <div class="flex-column" style="margin-top:16px">
        <mdl-button primary raised @click.native="publishQuestion()" v-bind:disabled="publishButton.disabled">
          添加到題集
        </mdl-button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import deltaRender from '../../modules/delta-render'
import Subject from '../../modules/Subjects'
import Language from '../../modules/Languages'
import sheetPannel from '../../components/reuseable/Sheet-pannel.vue'
import Card from '../../components/reuseable/Card'
import 'quill/dist/quill.snow.css'

// var delayTimer

export default {
  created: function () {
    this.newQuestion.language = this.getUserLanguage
  },
  components: {
    Subject,
    Card,
    sheetPannel
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
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
        let data = {
          language: this.newQuestion.language,
          type: 'mc',
          tags: this.newQuestion.tags,
          subject: this.newQcollection.subject,
          tips: this.newQuestion.tips,
          difficulty: this.newQuestion.difficulty,
          delta: this.newQuestion.delta,
          choices: this.newQuestion.choices,
          answer: {
            mc: this.newQuestion.answer.mc
          }
        }

        console.log(data)

        this.$http.post('/api/manage-question/questions', data).then(function (response) {
          this.qcollectionInbox.questions.push(response.data)
          this.addQuestionToCollection(response.data._id)
          this.publishButton.disabled = false
          this.newQuestion.delta = ''
          this.newQuestion.choices = ['', '', '', '']
          this.newQuestion.answer.mc = 0
          this.editorPreview = {
            question: { ops: [] },
            answer: {
              mc: [ { ops: [] }, { ops: [] }, { ops: [] }, { ops: [] } ]
            }
          }
          this.$emit('clear-editor')
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
    addQuestionToCollection: function (question_id) {
      if (question_id && this.newQcollection.id) {
        let data = {
          qcollection_id: this.newQcollection.id,
          question_id: question_id
        }
        this.$http.post('/api/manage-qcollection/add-question', data).then(function (response) {
          this.$showToast('發佈成功')
        }, function (response) {
          this.$showToast('失敗')
          console.log(response)
        })
      } else {
        this.$showToast('發生錯誤')
      }
    },
    getQuestions: function () {
      let qcollection_id = this.newQcollection.id
      let apiURL = '/api/manage-qcollection/qcollection?id=' + qcollection_id
      this.$http.get(apiURL).then(function (response) {
        this.qcollectionInbox.questions = response.data.questions
      }, function (response) {
        console.log(response)
      })
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
    renderQCInbox: function (option) {
      var divs = document.querySelectorAll('.question')

      if (option === 'all') {
        for (var i = 0; i < divs.length; i++) {
          window.renderMathInElement(
            divs[i],
            {
              delimiters: [
                {left: '$$', right: '$$', display: false}
              ]
            }
          )
        }
      } else if (!isNaN(option)) {
        window.renderMathInElement(
          divs[option],
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }
    },
    goToQCDetailView: function () {
      let path = {
        name: 'qcollection-detail',
        params: {
          qcollection_id: this.newQcollection.id
        }
      }
      this.$router.push(path)
    },
    createNewQcollection: function (option, qcollection) {
      if (option === 'from exist' && typeof qcollection === 'object') {
        this.newQcollection.name = qcollection.name
        this.newQcollection.subject = qcollection.subject
        this.newQcollection.public = qcollection.public
        this.newQcollection.id = qcollection._id
        this.getQuestions()
      } else {
        if (this.newQcollection.name.trim() !== '' && this.newQcollection.subject.trim() !== '') {
          let data = {
            name: this.newQcollection.name,
            subject: this.newQcollection.subject,
            public: this.newQcollection.public
          }
          this.$http.post('/api/manage-qcollection/qcollection', data).then(function (response) {
            console.log(response.data)
            this.newQcollection.id = response.data._id
          }, function (response) {
            console.log(response)
          })
        }
      }
    },
    getMyQcollections: function () {
      this.$http.get('/api/manage-qcollection/qcollections/mine').then(function (response) {
        if (response.data.length > 0) {
          this.newQcollection.myQcollections = response.data
          if (response.data.length < 12) {
            this.newQcollection.loadMore = false
          }
        } else {
          this.newQcollection.loadMore = false
        }
      }, function (response) {
        this.newQcollection.loadMore = false
        console.log(response)
      })
    },
    nextPage: function () {
      if (this.newQcollection.myQcollections.length > 0) {
        this.newQcollection.loadMore = false
        let latest_id = this.newQcollection.myQcollections[this.newQcollection.myQcollections.length - 1]._id
        let apiURL = '/api/manage-qcollection/mine?page=' + latest_id
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              this.newQcollection.myQcollections.push(response.data[i])
            }
            if (response.data.length < 12) {
              this.newQcollection.loadMore = false
            } else {
              this.newQcollection.loadMore = true
            }
          } else {
            this.newQcollection.loadMore = false
          }
        }, function (response) {
          this.newQcollection.loadMore = true
          console.log(response)
        })
      }
    },
    toggleQCInbox: function () {
      if (!this.qcollectionInbox.show) {
        this.renderQCInbox('all')
      }
      this.qcollectionInbox.show = !this.qcollectionInbox.show
    },
    ...mapActions(['setUserLanguage'])
  },
  data () {
    return {
      publishButton: {
        disabled: false
      },
      subjects: Subject.subjects,
      languages: Language.languages,
      tag: '',
      newQcollection: {
        name: '',
        subject: '',
        public: false,
        id: null,
        myQcollections: [],
        loadMore: true
      },
      qcollectionInbox: {
        show: false,
        questions: []
      },
      newQuestion: {
        language: '',
        type: 'mc',
        tags: [],
        tips: '',
        difficulty: 1,
        delta: '',
        choices: ['', '', '', ''],
        answer: {
          mc: 0
        }
      },
      editorPreview: {
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
  computed: mapGetters({
    getUserLanguage: 'getUserLanguage'
  })
}
</script>
