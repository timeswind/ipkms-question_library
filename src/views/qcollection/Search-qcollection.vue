<template>
  <div id="search-qcollection">
    <div class="search-zone">
      <div class="flex-column" style="max-width: 400px;margin: 0 auto">
        <div class="flex-row">
          <div class="flex-column flex-50">
            <span class="field-title">題集名字</span>
            <mdl-textfield label="題集名字" :value.sync="search.name" style="position: relative;top: -13px;width: 90%;"></mdl-textfield>
          </div>
          <div class="flex-column flex-50">
            <span class="field-title">科目</span>
            <select v-model="search.subject">
              <option v-for="subject in subjects" v-bind:value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex-column">
          <mdl-button primary raised @click="query()" :disabled="search.buttonDisable">搜索</mdl-button>
        </div>
      </div>

    </div>
    <div class="result-zone">
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--4-col qcollection-card" v-for="qc in results" track-by="_id" v-link="{ name: 'qcollection-detail', params: { qcollection_id: qc._id }}">

          <span class="qc-subject">{{qc.subject | subject}}</span>
          <span class="qc-public">{{qc.public | bTp}}</span>
          <p class="qc-createdby"></p>
          <p class="qc-title">{{qc.name}}</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Subject from '../../modules/Subjects'

export default {
  components: {

  },
  methods: {
    query: function () {
      if (this.search.name.trim() !== '' && this.search.subject.trim() !== '') {
        this.search.buttonDisable = true
        let data = {
          name: this.search.name,
          subject: this.search.subject
        }
        this.$http.post('/api/manage-qcollection/query', data).then(function (response) {
          console.log(response.data)
          this.results = response.data
          this.search.buttonDisable = false
        }, function (response) {
          console.log(response.data)
          this.search.buttonDisable = false
        })
      }
    }
  },
  data () {
    return {
      search: {
        buttonDisable: false,
        name: '',
        subject: '',
        options: {

        }
      },
      results: {},
      subjects: Subject.subjects
    }
  }
}
</script>

<style scoped>
.search-zone {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  border-radius: 3px;
  padding: 20px 0;
  margin: 0 16px;
}
</style>
