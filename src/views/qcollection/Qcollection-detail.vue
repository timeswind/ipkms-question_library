<template>
  <div id="qcollection-detail">
    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <card style="margin: 16px auto 0 auto;max-width: 600px">
      <div slot="content" style="padding: 16px" class="flex-column">
        <div class="flex-row flex-center" style="padding-bottom: 8px; border-bottom: 1px solid #eee">
          <span style="font-size: 20px">題集信息</span>
          <div v-if="!editMode">
            <mdl-button primary style="margin-left: 8px" @click="editMode = true">修改</mdl-button>
            <mdl-button accent style="margin-left: 8px" @click="deleteCollection()">刪除題集</mdl-button>
          </div>
          <div v-else>
            <mdl-button accent style="margin-left: 8px" @click="updateQcollectionInfo()">提交</mdl-button>
            <mdl-button primary style="margin-left: 8px" @click="editMode = false">取消</mdl-button>
          </div>
        </div>
        <div class="flex-column" v-if="!editMode" style="margin-top: 16px">
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">題集名字</span>
              <span class="field-content">{{qcinfo.name}}</span>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">科目</span>
              <span class="field-content">{{qcinfo.subject | subject}}</span>
            </div>
          </div>
          <div class="flex-row" style="margin-top: 16px">
            <div class="flex-column flex-50">
              <span class="field-title">是否公開</span>
              <span class="field-content">{{qcinfo.public | bTp}}</span>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">平均難度</span>
              <span class="field-content">{{averageDifficulty}}</span>
            </div>
          </div>
          <div class="flex-column" style="margin-top: 16px">
            <span class="field-title">描述</span>
            <span class="field-content">{{qcinfo.description}}</span>
          </div>
        </div>

        <div class="flex-column" v-else style="margin-top: 16px">
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">題集名字</span>
              <mdl-textfield :value.sync="qcinfo.name" style="position: relative;top: -13px;width: 90%;">{{qcinfo.name}}</mdl-textfield>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">科目</span>
              <select v-model="qcinfo.subject">
                <option v-for="subject in subjects" v-bind:value="subject.id">
                  {{ subject.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex-row" style="margin-top: -16px">
            <div class="flex-column flex-50">
              <span class="field-title">描述</span>
              <mdl-textfield label="" textarea rows="2" :value.sync="qcinfo.description" style="position: relative;top: -13px;width: 90%"></mdl-textfield>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">公開</span>
              <mdl-switch :checked.sync="qcinfo.public"></mdl-switch>
            </div>
          </div>

        </div>

      </div>
    </card>
    <div style="text-align: center;margin-top: 16px;font-size: 16px;color: #9E9E9E;">
      共 {{questions.length}} 題
    </div>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in questions">
        <div v-if="typeof q === 'object'">
          <div class="question-wrapper" v-link="{ name: 'question-detail', params: { question_id: q._id }}">
            <span class="q-subject">{{q.subject | subject}}</span>
            <span class="q-type">{{q.type}}</span>
            <div class="q-difficulty">
              <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
            </div>
            <div v-if="q.delta">
              <p class="q-context" v-html="renderDelta(q.delta)"></p>
            </div>
            <div v-if="q.context">
              <p class="q-context" v-html="q.context"></p>
            </div>
            <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
          </div>
          <div class="question-tools">
            <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入其他題集</mdl-button>
            <mdl-button v-on:click="removeOneQuestion(q._id, $index)"><i class="material-icons">close</i>移除</mdl-button>
          </div>
        </div>
        <div v-else class="flex-column">
          <span style="color:#999999;font-size: 18px;padding: 16px">該題已從題庫中移除</span>
          <div class="question-tools">
            <mdl-button v-on:click="removeOneQuestion(q, $index)"><i class="material-icons">delete_forever</i>删除</mdl-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import qcollectionSelectorModal from '../../components/reuseable/Select-qcollection.vue'
import sheetPannel from '../../components/reuseable/Sheet-pannel.vue'
import Subject from '../../modules/Subjects'
import Card from '../../components/reuseable/Card.vue'
import deltaRender from '../../modules/delta-render.js'

export default {
  ready: function () {
    this.getQcollection()
  },
  components: {
    Subject,
    qcollectionSelectorModal,
    sheetPannel,
    Card
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    deleteCollection: function () {
      let comfirmDelete = window.confirm('你確定要刪除這個題集？')
      if (comfirmDelete) {
        let data = {
          qcollection_id: this.qcinfo._id
        }
        var apiURL = '/api/manage-qcollection/qcollection'
        this.$http.delete(apiURL, data).then(function (response) {
          this.$showToast('操作成功')
          this.$router.go({ name: 'my-qcollection' })
        }, function (response) {
          console.log('fail to delete this qcollection')
        })
      }
    },
    getQcollection: function () {
      let qcollection_id = this.$route.params.qcollection_id
      let apiURL = '/api/manage-qcollection/qcollection' + '?id=' + qcollection_id
      this.$http.get(apiURL).then(function (response) {
        this.questions = response.data.questions
        delete response.data.questions
        this.qcinfo = response.data
        if (!_.has(response.data, 'description')) {
          this.qcinfo['description'] = ''
        }
        this.averageDifficulty = this.calculateAveDifficulty()
        this.renderQuestions()
      }, function (response) {
        console.log(response)
      })
    },
    renderQuestions: function () {
      setTimeout(function renderQuestions () {
        window.renderMathInElement(
          document.getElementById('questions-preview-container'),
          {
            delimiters: [
              {left: '$$', right: '$$', display: false}
            ]
          }
        )
      }, 0)
    },
    showCollectionModal: function (qid) {
      this.$broadcast('getMyQcollectionLists')
      this.CollectionModal.show = true
      this.CollectionModal.qid = qid
    },
    showSheetZone: function () {
      this.sheetshow = true
    },
    removeOneQuestion: function (question_id, index) {
      let comfirmDelete = window.confirm('你確定要從題集里移除這個題目？')
      if (comfirmDelete) {
        let data = {
          qcollection_id: this.qcinfo._id,
          question_id: question_id
        }
        let apiURL = '/api/manage-qcollection/qcollection/question'
        this.$http.delete(apiURL, data).then(function (response) {
          this.questions.splice(index, 1)
          this.$showToast('操作成功')
        }, function (response) {
          console.log('fail to remove this question')
        })
      }
    },
    updateQcollectionInfo: function () {
      let data = {
        qcollection_id: this.qcinfo._id,
        name: this.qcinfo.name,
        subject: this.qcinfo.subject,
        public: this.qcinfo.public,
        description: this.qcinfo.description
      }

      let apiURL = '/api/manage-qcollection/qcollection'
      this.$http.put(apiURL, data).then(function (response) {
        this.editMode = false
        this.$showToast('更新成功')
        console.log('update qcollection success')
      }, function (response) {
        console.log('fail to update this qcollection')
      })
    },
    updateDifficulty: function (newDifficulty) {
      let data = {
        qcollection_id: this.qcinfo._id,
        aveDifficulty: newDifficulty
      }
      let apiURL = '/api/manage-qcollection/update-difficulty'
      this.$http.put(apiURL, data).then(function (response) {
        console.log('update diffuculty success')
      }, function (response) {
        console.log('fail to update diffuculty')
      })
    },
    calculateAveDifficulty: function () {
      var sum = 0
      var result = 0
      if (this.questions.length !== 0) {
        var question_count = 0
        for (var q of this.questions) {
          if (_.isObject(q)) {
            question_count++
            if (!isNaN(q.difficulty)) {
              sum += q.difficulty
            }
          }
        }

        result = sum / question_count
        result = Math.round(result * 1e2) / 1e2 // 精确到2位小数
        if (this.qcinfo.aveDifficulty) {
          if (this.qcinfo.aveDifficulty !== result) {
            this.updateDifficulty(result)
          }
        } else {
          this.updateDifficulty(result)
        }
        return result
      } else {
        return 0
      }
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  data () {
    return {
      sheetshow: false,
      editMode: false,
      CollectionModal: {
        show: false,
        qid: undefined
      },
      qcinfo: {
        public: false
      },
      questions: [],
      averageDifficulty: 0,
      subjects: Subject.subjects
    }
  }
}
</script>
