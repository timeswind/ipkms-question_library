<template>
  <div id="all-question">
    <div class="filter">
      <mu-switch v-model="filter.time" label="時間倒序" />
    </div>
    <div class="mdl-grid" id="questions-preview-container">
      <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in questions" v-bind:key="q._id">
        <router-link tag="div" class="question-wrapper" :to="{ name: 'question-detail', params: { question_id: q._id }}">
          <span class="q-subject">{{q.subject | subject}}</span>
          <span class="q-type">{{q.type}}</span>
          <div class="q-difficulty">
            <i class="material-icons" v-for="i in getNumberArray(q.difficulty)">star_rate</i>
          </div>
          <div v-if="q.delta">
            <p class="q-context" v-html="renderDelta(q.delta)"></p>
          </div>
          <div v-if="q.context">
            <p class="q-context" v-html="q.context"></p>
          </div>
          <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
        </router-link>
        <div class="question-tools">
          <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入題集</mdl-button>
        </div>
      </div>
    </div>
    <div class="flex-column flex-center" style="margin:16px 0 32px 0">
      <mdl-button raised primary @click.native="nextPage()" :disabled="!loadMore">加載更多</mdl-button>
    </div>
  </div>
</template>

<script>
import qcollectionSelectorModal from '../../components/reuseable/Select-qcollection.vue'
import topbar from '../../components/reuseable/Topbar.vue'
import deltaRender from '../../modules/delta-render.js'

export default {
  mounted: function () {
    this.$nextTick(function () {
      this.getQuestions()
    })
  },
  components: {
    qcollectionSelectorModal,
    topbar
  },
  methods: {
    renderDelta: function (delta) {
      return deltaRender(delta)
    },
    getQuestions: function () {
      var sort = -1
      if (this.filter.time === true) {
        sort = 1
      }
      this.$http.get('/api/manage-question/questions?option=all&sort=' + sort).then(function (response) {
        if (response.data.length > 0) {
          this.questions = response.data
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
      this.$emit('getMyQcollectionLists')
      this.CollectionModal.show = true
      this.CollectionModal.qid = qid
    },
    nextPage: function () {
      if (this.questions.length > 0) {
        this.loadMore = false
        var sort = -1
        if (this.filter.time === true) {
          sort = 1
        }
        let latest_id = this.questions[this.questions.length - 1]._id
        let apiURL = '/api/manage-question/questions?option=all&page=' + latest_id + '&sort=' + sort
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
        this.getQuestions()
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
