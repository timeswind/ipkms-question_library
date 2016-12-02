<template>
  <div id="manage-question">
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="my-questions" title="我的題目"/>
      <mu-tab value="all-questions" title="所有題目"/>
      <mu-tab value="search-questions" title="搜索題目"/>
    </mu-tabs>
    <div v-if="activeTab === 'my-questions'">
      <div class="filter">
        <mu-switch v-model="filter.time" label="時間倒序" v-on:change="handleTimeSortChange()"/>
      </div>
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(question, index) in questions">
          <question-card mine :question="question" v-on:deleted="handleQuestionDeleted(index)" style="margin: 8px"/>
        </mu-col>
      </mu-row>
      <div class="flex-column flex-center" style="margin:16px 0 32px 0">
        <mu-raised-button label="加載更多" class="demo-raised-button" v-on:click="nextPage()" primary :disabled="!loadMore"/>
      </div>
    </div>
    <div v-if="activeTab === 'all-questions'">
      <div class="filter">
        <mu-switch v-model="filter.time" label="時間倒序" v-on:change="handleTimeSortChange()"/>
      </div>
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(question, index) in questions">
          <question-card :question="question" style="margin: 8px"/>
        </mu-col>
      </mu-row>
      <div class="flex-column flex-center" style="margin:16px 0 32px 0">
        <mu-raised-button label="加載更多" class="demo-raised-button" v-on:click="nextPage()" primary :disabled="!loadMore"/>
      </div>
    </div>
    <div v-if="activeTab === 'search-questions'">
      <div class="search-zone">
        <div v-show="search.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
          <span class="q-tag" v-for="(tag, index) in search.tags" @click="removeTag(index)" style="padding:4px 8px">{{tag}}</span>
        </div>
        <mu-text-field hintText="標籤.輸入回車" v-model="search.input" @keyup.enter.native="appendTag()"></mu-text-field>
        <span class="flex-column flex-center select-difficulty-box">
          <span class="flex-row flex-center">
            <span style="margin-right:8px">最低難度</span>
            <i v-for="n in 5" class="material-icons" @click="selectDifficulty('min', (n - 1))" :class="{'difficulty-heighlight': search.minDifficulty > (n - 1)}">star_rate</i>
          </span>
          <span class="flex-row flex-center">
            <span style="margin-right:8px">最高難度</span>
            <i v-for="n in 5" class="material-icons" @click="selectDifficulty('max', (n - 1))" :class="{'difficulty-heighlight': search.maxDifficulty > (n - 1)}">star_rate</i>
          </span>
        </span>
        <mu-switch v-show="search.tags.length !== 0" v-model="search.options.matchAny" style="width: 130px;margin-bottom: 16px" label="任意條件符合"/>
        <div>
          <mu-raised-button primary @click.native="searchQuestions()" :disabled="search.buttonDisable" label="搜索"></mu-raised-button>
        </div>
      </div>
      <div class="results-board" v-if="results.info">
        {{results.info}}
      </div>
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(question, index) in results.questions" v-bind:key="question._id">
          <question-card :question="question" style="margin: 8px"/>
        </mu-col>
      </mu-row>
    </div>
  </div>
</template>

<script>
import QuestionCard from '../../components/QuestionCard/QuestionCard.vue'
export default {
  mounted: function () {
    this.$nextTick(function () {
      this.getMyQuestions()
    })
  },
  data () {
    return {
      activeTab: 'my-questions',
      questions: [],
      loadMore: true,
      filter: {
        time: false,
        difficulty: null
      },
      AddToQcollectionDialogShow: false,
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
      results: {
        questions: [],
        info: ''
      }
    }
  },
  components: {
    'question-card': QuestionCard
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
          } else {
            this.loadMore = true
          }
          this.questions = response.data
        } else {
          this.loadMore = false
        }
      }, function (response) {
        this.loadMore = false
        console.log(response)
      })
    },
    nextPage: function () {
      if (this.questions.length > 0) {
        this.loadMore = false
        var sort = -1
        if (this.filter.time === true) {
          sort = 1
        }
        let latest_id = this.questions[this.questions.length - 1]._id
        var apiURL
        if (this.activeTab === 'my-questions') {
          apiURL = '/api/manage-question/questions?option=mine&page=' + latest_id + '&sort=' + sort
        } else if (this.activeTab === 'all-questions') {
          apiURL = '/api/manage-question/questions?option=all&page=' + latest_id + '&sort=' + sort
        }
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              this.questions.push(response.data[i])
            }
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
    getAllQuestions: function () {
      var sort = -1
      if (this.filter.time === true) {
        sort = 1
      }
      this.$http.get('/api/manage-question/questions?option=all&sort=' + sort).then(function (response) {
        if (response.data.length > 0) {
          this.questions = response.data
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
    searchQuestions: function () {
      if (this.search.input !== '') {
        this.appendTag()
      }
      if (this.search.tags.length === 0) {
        this.search.options.matchAny = true
      }
      this.results.info = ''
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
        if (response.data.length > 0) {
          this.results.questions = response.data
        } else {
          this.results.info = '未找到符合條件的題目'
        }
        this.search.buttonDisable = false
      }, function (response) {
        console.log(response.data)
        this.search.buttonDisable = false
      })
    },
    handleTimeSortChange () {
      if (this.activeTab) {
        if (this.activeTab === 'my-questions') {
          this.getMyQuestions()
        } else if (this.activeTab === 'all-questions') {
          this.getAllQuestions()
        }
      }
    },
    handleTabChange (tab) {
      this.questions = []
      if (tab === 'my-questions') {
        this.getMyQuestions()
      } else if (tab === 'all-questions') {
        this.getAllQuestions()
      }
      this.activeTab = tab
    },
    handleQuestionDeleted (index) {
      this.questions.splice(index, 1)
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
    }
  }
}
</script>
<style scoped>
.filter {
  background: #fff;
  padding: 16px;
  margin: 8px 8px 0 8px;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
}
.search-zone {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  border-radius: 3px;
  padding: 20px 0;
  text-align: center;
  margin: 8px;
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
.results-board {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  border-radius: 3px;
  padding: 16px 0;
  text-align: center;
  margin: 16px 16px 0 16px;
  color: #FF9800;
  font-size: 16px;
  border-left: 4px solid
}
</style>
