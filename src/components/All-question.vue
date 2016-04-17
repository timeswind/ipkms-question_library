<template>
  <div id="all-question">
    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in allQuestions" v-link="{ name: 'question-detail', params: { question_id: q._id }}">
        <div class="question-wrapper">
          <span class="q-subject">{{q.subject | subject}}</span>
          <span class="q-type">{{q.type}}</span>
          <div class="q-difficulty">
            <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
          </div>
          <p class="q-context">{{{q.context}}}</p>
          <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
        </div>
        <div class="question-tools">
          <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入題集</mdl-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'
import topbar from './reuseable/Topbar.vue'

export default {
  ready: function () {
    this.getAllQuestions()
  },
  components: {
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
      allQuestions: {}
    }
  }
}
</script>
