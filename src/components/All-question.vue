<template>
  <div id="all-question">
    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in questions" track-by="_id">
        <div class="question-wrapper" v-link="{ name: 'question-detail', params: { question_id: q._id }}">
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
    <div class="flex-column flex-center" style="margin:16px 0 32px 0">
      <mdl-button raised primary @click="nextPage()" :disabled="!loadMore">加載更多</mdl-button>
    </div>
  </div>
</template>

<script>
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'
import topbar from './reuseable/Topbar.vue'

export default {
  ready: function () {
    this.getQuestions()
  },
  components: {
    qcollectionSelectorModal,
    topbar
  },
  methods: {
    getQuestions: function () {
      this.$http.get('/api/manage-question/all').then(function (response) {
        if (response.data.length > 0) {
          this.questions = response.data
          this.renderQuestions()
          if (response.data.length < 9) {
            this.loadMore = false
          }
        } else {
          this.loadMore = false
        }
      }, function (response) {
        this.loadMore = false
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
    nextPage: function () {
      if (this.questions.length > 0) {
        this.loadMore = false
        let latest_id = this.questions[this.questions.length - 1]._id
        console.log(latest_id)
        let apiURL = '/api/manage-question/all?page=' + latest_id
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
              this.questions.push(response.data[i])
            }
            this.renderQuestions()
            if (response.data.length < 9) {
              this.loadMore = false
            } else {
              this.loadMore = true
            }
          } else {
            this.loadMore = false
          }
        }, function (response) {
          this.loadMore = true
          console.log(response)
        })
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
        qid: ''
      },
      questions: [],
      loadMore: true
    }
  }
}
</script>
