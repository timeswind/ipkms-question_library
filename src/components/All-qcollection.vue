<template>
  <div id="all-qcollection">

    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col qcollection" v-for="qc in allQcollections" v-show="!(onlyShowPrivate && qc.public)" v-link="{ name: 'qcollection-detail', params: { qcollection_id: qc._id }}">

        <span class="qc-subject">{{qc.subject | subject}}</span>
        <span class="qc-difficulty">{{qc.aveDifficulty}}</span>
        <span class="qc-public">{{qc.public | bTp}}</span>
        <p class="qc-createdby">作者：<i>{{qc.createdBy.local.name}}</i></p>
        <p class="qc-title">{{qc.name}}</p>

      </div>
    </div>
  </div>
</template>

<script>
import Subject from '../modules/Subjects'

export default {
  ready: function () {
    this.getAllQcollections()
  },
  components: {
    Subject
  },
  methods: {
    getAllQcollections: function () {
      this.$http.get('/api/manage-qcollection/all').then(function (response) {
        this.allQcollections = response.data
      }, function (response) {
        console.log(response)
      })
    }
  },
  data () {
    return {
      allQcollections: {}
    }
  }
}
</script>
