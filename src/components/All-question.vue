<style>
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
.q-context {
  margin: 0;
  font-size: 16px;
  padding-left: 12px;
  border-left: 4px solid #3F51B5;
  margin-top: 20px;
  margin-bottom: 20px
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
</style>
<template>
  <div id="all-question">

    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question" v-for="q in allQuestions">
        <div class="question-wrapper">
          <span class="q-subject">{{idToName(q.subject)}}</span>
          <span class="q-type">{{q.type}}</span>
          <div class="q-difficulty">
            <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
          </div>
          <p class="q-context">{{{q.context}}}</p>
          <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
        </div>
        <div class="question-tools">
          <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入題集</mdl-button>
          <mdl-button v-link="{ name: 'question-detail', params: { question_id: q._id }}"><i class="material-icons">search</i>查看</mdl-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vmdl from 'vue-mdl'
import Vue from 'vue'
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'
import topbar from './reuseable/Topbar.vue'

import '../css/main.css'

vmdl.register(Vue, 'mdlCheckbox')
vmdl.register(Vue, 'mdlButton')
vmdl.register(Vue, 'mdlTextfield')
vmdl.register(Vue, 'mdlSwitch')

var checkbox = vmdl.components['mdlCheckbox']
var button = vmdl.components['mdlButton']
var textfield = vmdl.components['mdlTextfield']
var mdlSwitch = vmdl.components['mdlSwitch']

export default {
  ready: function () {
    this.getAllQuestions()
  },
  components: {
    mdlButton: button,
    mdlCheckbox: checkbox,
    mdlTextfield: textfield,
    mdlSwitch: mdlSwitch,
    qcollectionSelectorModal,
    topbar
  },
  methods: {
    getAllQuestions: function () {
      this.$http.get('/api/manage-question/all').then(function (response) {
        this.allQuestions = response.data
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
      CollectionModal: {
        show: false,
        qid: '1234'
      },
      allQuestions: {},
      subjects: [
        { name: '數學', id: 'math' },
        { name: '物理', id: 'phy' }
      ]
    }
  }
}
</script>
