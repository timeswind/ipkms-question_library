<template>
  <div class="question-card">
    <div v-if="!deleted">
      <router-link tag="div" class="question-wrapper" :to="{ name: 'question-detail', params: { question_id: question._id }}">
        <span class="q-subject">{{question.subject | subject}}</span>
        <span class="q-type">{{question.type}}</span>
        <div class="q-difficulty">
          <i class="material-icons" v-for="i in question.difficulty">star_rate</i>
        </div>
        <div v-if="question.delta">
          <p class="q-context" v-html="renderDelta(question.delta)"></p>
        </div>
        <div v-if="question.context">
          <p class="q-context" v-html="question.context"></p>
        </div>
        <span class="q-tag" v-for="tag in question.tags">{{tag}}</span>
      </router-link>
      <div class="question-tools flex-row" v-if="qcollection === true">
        <mu-flat-button v-on:click="setQcollectionSelectorStatus({show: true, questionId:question._id, type:'add-question-to-qcollection'})"><i class="material-icons">add</i>加入其他題集</mu-flat-button>
        <mu-flat-button v-on:click="removeQuestionFromCollection()"><i class="material-icons">close</i>移除</mu-flat-button>
      </div>
      <div class="question-tools flex-row" v-else>
        <mu-flat-button v-on:click="setQcollectionSelectorStatus({show: true, questionId:question._id, type:'add-question-to-qcollection'})"><i class="material-icons">add</i>加入題集</mu-flat-button>
        <mu-flat-button v-if="mine" v-on:click="deleteQuestion(question._id)"><i class="material-icons">close</i>刪除</mu-flat-button>
      </div>
    </div>
    <div v-else>
      <div style="color:#999999;font-size: 18px;padding: 16px">該題已從題庫中移除</div>
      <div class="question-tools">
        <mu-flat-button v-on:click="removeQuestionFromCollection()"><i class="material-icons">delete_forever</i>移除</mu-flat-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import deltaRender from '../../modules/delta-render.js'

export default {
  name: 'question-card',
  props: {
    question: {
      type: Object,
      default: {}
    },
    mine: {
      type: Boolean,
      default: false
    },
    qcollection: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    renderDelta (delta) {
      console.log(delta)
      return deltaRender(delta)
    },
    deleteQuestion (question_id) {
      let comfirmDelete = window.confirm('你確定要刪除這個題目？')
      if (comfirmDelete) {
        var apiURL = '/api/manage-question/question/' + question_id
        this.$http.delete(apiURL).then(function (response) {
          this.$showToast('操作成功')
          this.$emit('deleted')
        }, function (response) {
          this.$showToast('操作失敗')
        })
      }
    },
    removeQuestionFromCollection () {
      this.$emit('delete')
    },
    ...mapActions({
      setQcollectionSelectorStatus: 'setQcollectionSelectorStatus'
    })
  }
}
</script>

<style scoped>
.question-card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  height: 100%;
}
.q-subject {
  background-color: #2196F3;
  color: #fff;
  padding: 4px 8px;
  border-radius: 3px;
  display: inline-block;
  margin-top: 3px;
}
.q-type {
  color: #2196F3;
}
.q-context {
  margin: 0;
  font-size: 16px;
  /*padding-left: 12px;*/
  /*border-left: 4px solid #3F51B5;*/
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
  margin:8px 4px 0 0;
  padding: 2px 4px;
  border: 1px solid #e91e63;
  cursor: pointer;
}
.question-tools {
  padding: 4px 0;
  border-top: 1px solid #EEEEEE;
}
.question-tools button {
  color: #616161
}
</style>
