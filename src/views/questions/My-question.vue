<template>
  <div id="my-question">
    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="filter">
      <mdl-switch :checked.sync="filter.time">時間倒序</mdl-switch>
    </div>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in myQuestions" track-by="_id">
        <div class="question-wrapper" v-link="{ name: 'question-detail', params: { question_id: q._id }}">
          <span class="q-subject">{{q.subject | subject}}</span>
          <span class="q-type">{{q.type}}</span>
          <div class="q-difficulty">
            <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
          </div>
          <p class="q-context" v-html="q.context"></p>
          <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
        </div>
        <div class="question-tools flex-row">
          <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入題集</mdl-button>
          <mdl-button v-on:click="deleteSingleQuestion(q._id, $index)"><i class="material-icons">close</i>刪除</mdl-button>
        </div>
      </div>
    </div>
    <div class="flex-column flex-center" style="margin:16px 0 32px 0">
      <mdl-button raised primary @click="nextPage()" :disabled="!loadMore">加載更多</mdl-button>
    </div>
  </div>
</template>

<script>
import qcollectionSelectorModal from '../../components/reuseable/Select-qcollection.vue'
export default {
  ready: function () {
    this.getMyQuestions()
  },
  components: {
    qcollectionSelectorModal
  },
  methods: {
    getMyQuestions: function () {
      var sort = -1
      if (this.filter.time === true) {
        sort = 1
      }
      this.$http.get('/api/manage-question/questions?option=mine&sort=' + sort).then(function (response) {
        if (response.data.length > 0) {
          if (response.data.length < 9) {
            this.loadMore = false
          }
          this.myQuestions = response.data
          this.renderQuestions()
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
    deleteSingleQuestion: function (question_id, index) {
      let comfirmDelete = window.confirm('你確定要刪除這個題目？')
      if (comfirmDelete) {
        var apiURL = '/api/manage-question/question/' + question_id
        this.$http.delete(apiURL).then(function (response) {
          this.$showToast('操作成功')
          this.myQuestions.splice(index, 1)
        }, function (response) {
          this.$showToast('操作失敗')
        })
      }
    },
    showCollectionModal: function (qid) {
      this.$broadcast('getMyQcollectionLists')
      this.CollectionModal.show = true
      this.CollectionModal.qid = qid
    },
    nextPage: function () {
      if (this.myQuestions.length > 0) {
        this.loadMore = false
        var sort = -1
        if (this.filter.time === true) {
          sort = 1
        }
        let latest_id = this.myQuestions[this.myQuestions.length - 1]._id
        let apiURL = '/api/manage-question/questions?option=mine&page=' + latest_id + '&sort=' + sort
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              this.myQuestions.push(response.data[i])
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
        qid: '1234'
      },
      myQuestions: [],
      loadMore: true,
      filter: {
        time: false,
        difficulty: null
      }
    }
  },
  watch: {
    'filter': {
      handler: function () {
        this.loadMore = true
        this.getMyQuestions()
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.filter {
  background: #fff;
  padding: 16px;
  margin: 0 16px 0 16px;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
}
</style>
