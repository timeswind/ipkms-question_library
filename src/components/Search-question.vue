<style>
#search-question .search-zone {
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35);
  padding: 20px 0;
  text-align: center;
}

#search-question .results-zone {

}

</style>
<template>
  <div id="search-question">

    <qcollection-selector-modal :show.sync="CollectionModal.show" :qid="CollectionModal.qid"></qcollection-selector-modal>
    <div class="search-zone">
      <div v-show="search.tags.length !== 0" style="padding-top: 25px;margin-right: 10px;">
        <span class="q-tag" @click="removeTag($index)" v-for="tag in search.tags" track-by="$index" style="padding:4px 8px">{{tag}}</span>
      </div>
      <mdl-textfield label="標籤" :value.sync="search.input" @keyup.enter="appendTag()"></mdl-textfield>
      <div>
        <mdl-button primary raised v-show="search.tags.length !== 0" @click="queryByTags()" :disabled="search.buttonDisable">搜索</mdl-button>
      </div>
    </div>
    <div class="results-zone">
      <div class="mdl-grid" id="questions-preview-container">
        <div class="mdl-cell mdl-cell--4-col question" v-for="q in results">
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
            <mdl-button v-link="{ name: 'question-detail', params: { question_id: q._id }}"><i class="material-icons">search</i>查看</mdl-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vmdl from 'vue-mdl'
import Vue from 'vue'
import qcollectionSelectorModal from './reuseable/Select-qcollection.vue'

vmdl.register(Vue, 'mdlCheckbox')
vmdl.register(Vue, 'mdlButton')
vmdl.register(Vue, 'mdlTextfield')
vmdl.register(Vue, 'mdlSwitch')

var checkbox = vmdl.components['mdlCheckbox']
var button = vmdl.components['mdlButton']
var textfield = vmdl.components['mdlTextfield']
var mdlSwitch = vmdl.components['mdlSwitch']

export default {
  components: {
    mdlButton: button,
    mdlCheckbox: checkbox,
    mdlTextfield: textfield,
    mdlSwitch: mdlSwitch,
    qcollectionSelectorModal
  },
  methods: {
    queryByTags: function () {
      if (this.search.tags.length > 0) {
        this.search.buttonDisable = true
        let data = {
          tags: this.search.tags
        }
        this.$http.post('/api/manage-question/query/tags', data).then(function (response) {
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
      }
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
    }
  },
  data () {
    return {
      search: {
        buttonDisable: false,
        input: '',
        tags: []
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
