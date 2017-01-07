<template>
  <div id="qcollection-detail">
    <div style="margin: 16px auto 0 auto;max-width: 600px" class="light-card">
      <div slot="content" style="padding: 16px" class="flex-column">
        <div class="flex-row flex-center" style="padding-bottom: 8px; border-bottom: 1px solid #eee">
          <span style="font-size: 20px">題集信息</span>
          <div v-if="!editMode" style="margin-left: auto">
            <mu-flat-button label="修改" primary style="margin-left: 16px; color: #3F51B5" @click="editMode = true" />
            <mu-flat-button label="刪除題集" style="margin-left: 8px; color: #f44336" @click="deleteCollection()" />
          </div>
          <div v-else style="margin-left: auto">
            <mu-raised-button primary label="提交" style="margin-left: 16px" @click="updateQcollectionInfo()" />
            <mu-flat-button label="取消" primary style="margin-left: 8px" @click="editMode = false" />
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
              <span class="field-title">開放編輯</span>
              <span class="field-content">{{qcinfo.openForEdit | bTw}}</span>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">學生可見</span>
              <span class="field-content">{{qcinfo.openToStudent | bTw}}</span>
            </div>
          </div>
          <div class="flex-row" style="margin-top: 16px">
            <div class="flex-column flex-50">
              <span class="field-title">校内公開</span>
              <span class="field-content">{{qcinfo.openInSchool | bTw}}</span>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">校外公開</span>
              <span class="field-content">{{qcinfo.openOutSchool | bTw}}</span>
            </div>
          </div>
          <div class="flex-row" style="margin-top: 16px">
            <div class="flex-column flex-50">
              <span class="field-title">平均難度</span>
              <span class="field-content">{{averageDifficulty}}</span>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">描述</span>
              <span class="field-content">{{qcinfo.description}}</span>
            </div>
          </div>
        </div>

        <div class="flex-column" v-else style="margin-top: 16px">
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">題集名字</span>
              <mu-text-field v-model="qcinfo.name"/>
            </div>
            <div class="flex-column flex-50">
              <mu-select-field v-model="qcinfo.subject" label="科目">
                <mu-menu-item v-for="subject in subjects" :value="subject.id" :title="subject.name"/>
              </mu-select-field>
            </div>
          </div>
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">開放編輯</span>
              <mu-switch v-model="qcinfo.openForEdit"/>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">學生可見</span>
              <mu-switch v-model="qcinfo.openToStudent"/>
            </div>
          </div>
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">校內公開</span>
              <mu-switch v-model="qcinfo.openInSchool"/>
            </div>
            <div class="flex-column flex-50">
              <span class="field-title">校外公開</span>
              <mu-switch v-model="qcinfo.openOutSchool"/>
            </div>
          </div>
          <div class="flex-row" style="margin-top: 8px">
            <div class="flex-column flex-50">
              <span class="field-title">描述</span>
              <mu-text-field v-model="qcinfo.description" multiLine :rows="3" :rowsMax="6"/>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div style="text-align: center;margin-top: 16px;font-size: 16px;color: #9E9E9E;">
      共 {{questions.length}} 題
    </div>
    <mu-row>
      <mu-col width="100" tablet="50" desktop="33" v-for="(question, index) in questions">
        <div v-if="typeof question === 'object'" style="margin: 8px">
          <question-card :question="question" :qcollection="true" v-on:delete="removeOneQuestion(question._id, index)"/>
        </div>
        <div v-else class="flex-column" style="margin: 8px">
          <question-card :deleted="true" v-on:delete="removeOneQuestion(question, index)"/>
        </div>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
import _ from 'lodash'
import QuestionCard from '../../components/QuestionCard/QuestionCard'
import deltaRender from '../../modules/delta-render.js'

export default {
  mounted: function () {
    this.$nextTick(function () {
      this.getQcollection()
    })
  },
  components: {
    'question-card': QuestionCard
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    deleteCollection: function () {
      let comfirmDelete = window.confirm('你確定要刪除這個題集？')
      if (comfirmDelete) {
        var apiURL = '/api/manage-qcollection/qcollection/' + this.qcinfo._id
        this.$http.delete(apiURL).then(function (response) {
          this.$showToast('操作成功')
          this.$router.push({ name: 'manage-qcollection' })
        }, function (response) {
          this.$showToast('fail to delete this qcollection')
          console.log('fail to delete this qcollection')
        })
      }
    },
    getQcollection: function () {
      let qcollection_id = this.$route.params.qcollection_id
      let apiURL = '/api/manage-qcollection/qcollection/' + qcollection_id
      this.$http.get(apiURL).then(function (response) {
        this.questions = response.data.questions
        delete response.data.questions
        this.qcinfo = response.data
        if (!_.has(response.data, 'description')) {
          this.qcinfo['description'] = ''
        }
        this.averageDifficulty = this.calculateAveDifficulty()
      }, function (response) {
        console.log(response)
      })
    },
    removeOneQuestion: function (question_id, index) {
      let comfirmDelete = window.confirm('你確定要從題集里移除這個題目？')
      if (comfirmDelete) {
        let apiURL = `/api/manage-qcollection/question?qcollection_id=${this.qcinfo._id}&question_id=${question_id}`
        this.$http.delete(apiURL).then(function (response) {
          this.questions.splice(index, 1)
          this.$showToast('操作成功')
        }, function (response) {
          console.log('fail to remove this question')
        })
      }
    },
    updateQcollectionInfo: function () {
      let data = {
        name: this.qcinfo.name,
        subject: this.qcinfo.subject,
        openForEdit: this.qcinfo.openForEdit,
        openInSchool: this.qcinfo.openInSchool,
        openOutSchool: this.qcinfo.openOutSchool,
        openToStudent: this.qcinfo.openToStudent,
        description: this.qcinfo.description
      }

      let apiURL = '/api/manage-qcollection/qcollection/' + this.qcinfo._id
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
      editMode: false,
      qcinfo: {},
      questions: [],
      averageDifficulty: 0
    }
  },
  computed: {
    subjects () {
      return this.$store.getters.getSubjects
    }
  }
}
</script>
