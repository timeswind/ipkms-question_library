<template>
  <div id="all-qcollection">

    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col qcollection" v-for="qc in allQcollections" v-show="!(onlyShowPrivate && qc.public)" v-link="{ name: 'qcollection-detail', params: { qcollection_id: qc._id }}">

        <span class="qc-subject">{{idToName(qc.subject)}}</span>
        <span class="qc-public">{{booleanToPublic(qc.public)}}</span>
        <p class="qc-createdby">作者：<i>{{qc.createdBy.local.name}}</i></p>
        <p class="qc-title">{{qc.name}}</p>

      </div>
    </div>
  </div>
</template>

<script>
import Subject from './reuseable/Subject'

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
    },
    idToName: function (id) {
      var array = this.subjects
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return array[i].name
        }
      }
    },
    booleanToPublic: function (boolean) {
      if (boolean) {
        return '公開'
      } else {
        return '私有'
      }
    }
  },
  data () {
    return {
      allQcollections: {},
      subjects: Subject.subjects
    }
  }
}
</script>
