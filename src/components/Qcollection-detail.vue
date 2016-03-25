<style>
.block {
  display: block;
}
select {
  background: transparent;
  border: 0;
  border-bottom: 1px solid #DADADA;
  width: 200px;
  padding: 5px;
  font-size: 16px;
  line-height: 1;
  border-radius: 0;
  height: 34px;
  -webkit-appearance: none;
}

.question {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  height: 100%;
}
.question-wrapper {
  padding: 16px;
}
.q-subject {
  background-color: #2196F3;
  color: #fff;
  padding: 4px 8px;
  border-radius: 14px;
  display: inline-block;
  margin-top: 3px;
}
.q-type {
  border-bottom: 2px solid #2196F3;
}

.q-difficulty {
  float: right;
}
.q-difficulty i {
  width: 24px;
  color: #FFC107
}
.q-tag {
  color: #E91E63;
  margin: 0 5px;
  padding: 2px 4px;
  border: 1px solid #e91e63;
}
.question-tools {
  padding: 4px 0;
  border-top: 1px solid #EEEEEE;
}

.question-tools button {
  color: #616161
}

#secondary-panel {
  padding: 16px;
  border-bottom: 1px solid #ccc;
}

</style>
<template>
  <div id="qcollection-detail">
    <sheet-pannel :sheetshow.sync="sheetshow">
      <div slot="sheet-title" class="flex">
        <h4 style="margin:0;margin-right:10px">{{details.name}}</h4>
        <mdl-button primary raised v-on:click="showSheetZone()" class="sheet-button" v-show="!sheetshow">
          修改题集信息
        </mdl-button>
        <mdl-button accent v-on:click="deleteCollection()" class="sheet-button" v-show="sheetshow">
          刪除題集
        </mdl-button>
      </div>
      <div slot="sheet-zone">
        <div class="block">
          <mdl-textfield :value.sync="details.name">{{details.name}}</mdl-textfield>
        </div>
        <div class="block">
          科目：
          <select v-model="details.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="block" style="padding:20px 0">
          <input type="checkbox" id="public-checkbox" v-model="details.public">
          <label for="public-checkbox">公開</label>
        </div>
        <mdl-button accent raised @click="updateQcollectionInfo()">
          修改
        </mdl-button>
        <mdl-button @click="sheetshow = false">
          關閉
        </mdl-button>p
      </div>
    </sheet-pannel>
    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <p class="qc-d-average-difficulty">平均難度：{{averageDifficulty}}</p>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question" v-for="q in details.questions">
        <div class="question-wrapper">
          <span class="q-subject">{{idToName(q.subject)}}</span>
          <span class="q-type">{{q.type}}</span>
          <div class="q-difficulty">
            <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
          </div>
          <p class="qc-context">{{{q.context}}}</p>
          <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
        </div>
        <div class="question-tools">
          <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入其他題集</mdl-button>
          <mdl-button v-link="{ name: 'question-detail', params: { question_id: q._id }}"><i class="material-icons">search</i>查看</mdl-button>
          <mdl-button v-on:click="removeOneQuestion(q._id, $index)"><i class="material-icons">close</i>移除</mdl-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vmdl from 'vue-mdl'
import Vue from 'vue'
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'
import sheetPannel from './reuseable/Sheet-pannel.vue'
import Subject from './reuseable/Subject'

import '../css/main.css'

vmdl.register(Vue, 'mdlButton')
vmdl.register(Vue, 'mdlTextfield')
vmdl.register(Vue, 'mdlSwitch')

var button = vmdl.components['mdlButton']
var textfield = vmdl.components['mdlTextfield']
var mdlSwitch = vmdl.components['mdlSwitch']

export default {
  ready: function () {
    this.getQuestions()
  },
  components: {
    Subject,
    mdlButton: button,
    mdlTextfield: textfield,
    mdlSwitch: mdlSwitch,
    qcollectionSelectorModal,
    sheetPannel
  },
  methods: {
    deleteCollection: function () {
      let comfirmDelete = window.confirm('你確定要刪除這個題集？')
      if (comfirmDelete) {
        let data = {
          qcollection_id: this.details._id
        }
        var apiURL = '/api/manage-qcollection/delete/single'
        this.$http.delete(apiURL, data).then(function (response) {
          this.$router.go({ name: 'manage-qcollection' })
        }, function (response) {
          console.log('fail to delete this qcollection')
        })
      }
    },
    getQuestions: function () {
      let qcollection_id = this.$route.params.qcollection_id
      let apiURL = '/api/manage-qcollection/detail/' + qcollection_id
      this.$http.get(apiURL).then(function (response) {
        this.details = response.data
        this.averageDifficulty = this.calculateAverageDifficulty()
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
          qcollection_id: this.details._id,
          question_id: question_id
        }
        let apiURL = '/api/manage-qcollection/remove-question'
        this.$http.delete(apiURL, data).then(function (response) {
          this.details.questions.splice(index, 1)
        }, function (response) {
          console.log('fail to remove this question')
        })
      }
    },
    updateQcollectionInfo: function () {
      let data = {
        qcollection_id: this.details._id,
        name: this.details.name,
        subject: this.details.subject,
        public: this.details.public
      }

      let apiURL = '/api/manage-qcollection/update-info'
      this.$http.put(apiURL, data).then(function (response) {
        this.sheetshow = false
      }, function (response) {
        console.log('fail to update this qcollection')
      })
    },
    updateDifficulty: function (newDifficulty) {
      let data = {
        qcollection_id: this.details._id,
        aveDifficulty: newDifficulty
      }

      let apiURL = '/api/manage-qcollection/update-difficulty'
      this.$http.put(apiURL, data).then(function (response) {

      }, function (response) {
        console.log('fail to update this qcollection')
      })
    },
    calculateAverageDifficulty: function () {
      var sum = 0
      var result = 0
      if (this.details.questions.length !== 0) {
        for (var q of this.details.questions) {
          // truncate the sequence at 1000
          sum += q.difficulty
        }
        result = (sum / this.details.questions.length).toFixed(2)
        if (this.details.aveDifficulty) {
          if (this.details.aveDifficulty.toFixed(2) !== result) {
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
    idToName: function (id) {
      var array = this.subjects
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return array[i].name
        }
      }
    },
    getNumberArray: function (num) {
      return new Array(num)
    }
  },
  data () {
    return {
      sheetshow: false,
      CollectionModal: {
        show: false,
        qid: undefined
      },
      details: {},
      averageDifficulty: 0,
      subjects: Subject.subjects
    }
  }
}
</script>
