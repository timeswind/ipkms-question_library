<template>
  <div id="all-qcollection">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col qcollection-card" v-for="qc in allQcollections" track-by="_id" v-show="!(onlyShowPrivate && qc.public)" v-link="{ name: 'qcollection-detail', params: { qcollection_id: qc._id }}">

        <span class="qc-subject">{{qc.subject | subject}}</span>
        <span class="qc-difficulty" v-show="qc.aveDifficulty">難度: {{qc.aveDifficulty}}</span>
        <span class="qc-public">{{qc.public | bTp}}</span>
        <p class="qc-createdby">作者：<i>{{qc.createdBy.local.name}}</i></p>
        <p class="qc-title">{{qc.name}}</p>

      </div>
    </div>

    <div class="flex-column flex-center" style="margin:16px 0 32px 0">
      <mdl-button raised primary @click="nextPage()" :disabled="!loadMore">加載更多</mdl-button>
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
        if (response.data.length > 0) {
          this.allQcollections = response.data
          if (response.data.length < 12) {
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
    nextPage: function () {
      if (this.allQcollections.length > 0) {
        this.loadMore = false
        let latest_id = this.allQcollections[this.allQcollections.length - 1]._id
        console.log(latest_id)
        let apiURL = '/api/manage-qcollection/all?page=' + latest_id
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              this.allQcollections.push(response.data[i])
            }
            if (response.data.length < 12) {
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
    }
  },
  data () {
    return {
      allQcollections: [],
      loadMore: true
    }
  }
}
</script>
