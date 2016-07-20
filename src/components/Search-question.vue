<style scoped>
.search-zone {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  border-radius: 3px;
  padding: 20px 0;
  text-align: center;
  margin: 0 16px;
}

.difficulty-heighlight{
  color: #FFC107 !important
}
.select-difficulty-box {
  color: #aaa;
  margin-bottom: 16px
}
.select-difficulty-box i {
  width: 24px;
  cursor: pointer;
}
.q-tag {
  cursor: pointer;
}
</style>
<template>
  <div id="search-question">

    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="search-zone">
      <div v-show="search.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
        <span class="q-tag" @click="removeTag($index)" v-for="tag in search.tags" track-by="$index" style="padding:4px 8px">{{tag}}</span>
      </div>
      <mdl-textfield label="標籤.輸入回車" :value.sync="search.input" @keyup.enter="appendTag()"></mdl-textfield>
      <span class="flex-column flex-center select-difficulty-box">
        <span class="flex-row flex-center">
          <span style="margin-right:8px">最低難度</span>
          <i v-for="n in 5" class="material-icons" @click="selectDifficulty('min', $index)" :class="{'difficulty-heighlight': search.minDifficulty > $index}">star_rate</i>
        </span>
        <span class="flex-row flex-center">
          <span style="margin-right:8px">最高難度</span>
          <i v-for="n in 5" class="material-icons" @click="selectDifficulty('max', $index)" :class="{'difficulty-heighlight': search.maxDifficulty > $index}">star_rate</i>
        </span>
      </span>
      <mdl-switch v-show="search.tags.length !== 0" :checked.sync="search.options.matchAny" style="width: 130px;margin-bottom: 16px">任意條件符合</mdl-switch>
      <div>
        <mdl-button primary raised @click="query()" :disabled="search.buttonDisable">搜索</mdl-button>
      </div>
    </div>
    <div class="results-zone">
      <div class="mdl-grid" id="questions-preview-container">
        <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in results" track-by="_id">
          <div class="question-wrapper" v-link="{ name: 'question-detail', params: { question_id: q._id }}">
            <span class="q-subject">{{q.subject | subject}}</span>
            <span class="q-type">{{q.type}}</span>
            <div class="q-difficulty">
              <i class="material-icons" v-for="i in getNumberArray(q.difficulty)" track-by="$index">star_rate</i>
            </div>
            <p class="q-context" v-html="q.context"></p>
            <span class="q-tag" v-for="tag in q.tags">{{tag}}</span>
          </div>
          <div class="question-tools">
            <mdl-button v-on:click="showCollectionModal(q._id)"><i class="material-icons">add</i>加入題集</mdl-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'

export default {
  components: {
    qcollectionSelectorModal
  },
  methods: {
    query: function () {
      if (this.search.input !== '') {
        this.appendTag()
      }
      if (this.search.tags.length === 0) {
        this.search.options.matchAny = true
      }
      this.search.buttonDisable = true
      let data = {
        tags: this.search.tags,
        difficulty: {
          min: this.search.minDifficulty,
          max: this.search.maxDifficulty
        },
        options: {
          matchAny: this.search.options.matchAny
        }
      }
      this.$http.post('/api/manage-question/query', data).then(function (response) {
        console.log(response.data)
        this.results = response.data
        if (response.data.length > 0) {
          this.renderQuestions()
        }
        this.search.buttonDisable = false
      }, function (response) {
        console.log(response.data)
        this.search.buttonDisable = false
      })
    },
    appendTag: function (tag) {
      if (this.search.input.trim() !== '') {
        this.search.tags.push(this.search.input)
        this.search.input = ''
      }
    },
    removeTag: function (index) {
      this.search.tags.splice(index, 1)
    },
    renderQuestions: function () {
      let length = this.results.length

      setTimeout(function renderQuestions () {
        for (var i = 0; i < length; i++) {
          window.renderMathInElement(
            document.getElementsByClassName('q-context')[i],
            {
              delimiters: [
                {left: '$$', right: '$$', display: false}
              ]
            }
          )
        }
      }, 0)
    },
    getNumberArray: function (num) {
      return new Array(num)
    },
    selectDifficulty: function (type, difficulty) {
      difficulty = difficulty + 1
      if (type === 'min') {
        if (!(difficulty > this.search.maxDifficulty)) {
          this.search.minDifficulty = difficulty
        } else {
          this.search.minDifficulty = difficulty
          this.search.maxDifficulty = difficulty
        }
      } else {
        if (!(difficulty < this.search.minDifficulty)) {
          this.search.maxDifficulty = difficulty
        } else {
          this.search.minDifficulty = difficulty
          this.search.maxDifficulty = difficulty
        }
      }
    },
    showCollectionModal: function (qid) {
      this.$broadcast('getMyQcollectionLists')
      this.CollectionModal.show = true
      this.CollectionModal.qid = qid
    }
  },
  data () {
    return {
      search: {
        buttonDisable: false,
        input: '',
        tags: [],
        minDifficulty: 1,
        maxDifficulty: 5,
        options: {
          matchAny: false
        }
      },
      CollectionModal: {
        show: false,
        qid: ''
      },
      results: {}
    }
  }
}
</script>
