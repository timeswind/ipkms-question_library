<style>
#my-qcollection .sheet-pannel {
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35)
}

#my-qcollection .expand-transition {
  max-height: 400px;
  transition: all .3s ease;
  padding: 16px 32px;
  padding-bottom: 32px;
  overflow: hidden;
}

#my-qcollection .expand-enter, #my-qcollection .expand-leave {
  max-height: 0;
  padding: 0;
  opacity: 0;
}
</style>

<template>
  <div id="my-qcollection">
    <div class="sheet-pannel">
      <div class="sheet-zone" v-show="showCreatSheet" transition="expand">
        <div class="block">
          <mdl-textfield floating-label="題集名字" :value.sync="newQcollection.name"></mdl-textfield>
        </div>
        <div class="block">
          科目：
          <select v-model="newQcollection.subject">
            <option v-for="subject in subjects" v-bind:value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="block" style="padding:20px 0">
          <mdl-checkbox :checked.sync="newQcollection.public">公開</mdl-checkbox>
        </div>
        <mdl-button accent raised v-on:click="createNewQcollection">
          創建
        </mdl-button>
        <mdl-button v-show="showCreatSheet" @click="showCreatSheet = false">
          關閉
        </mdl-button>
      </div>
    </div>
    <div id="secondary-panel">
      <div class="flex">
        <div>
          <mdl-button primary raised @click="showCreatSheet = true">
            創建新題集
          </mdl-button>
        </div>
        <div style="position: relative;top: 6px;left: 10px;">
          <mdl-switch :checked.sync="onlyShowPrivate">只顯示私有題集</mdl-switch>

        </div>
      </div>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--4-col qcollection-card" v-for="qc in myQcollections" track-by="_id" v-show="!(onlyShowPrivate && qc.public)" v-link="{ name: 'qcollection-detail', params: { qcollection_id: qc._id }}">

        <span class="qc-subject">{{qc.subject | subject}}</span>
        <span class="qc-public">{{qc.public | bTp}}</span>
        <p class="qc-createdby"></p>
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
    this.getMyQcollections()
  },
  components: {
    Subject
  },
  methods: {
    getMyQcollections: function () {
      this.$http.get('/api/manage-qcollection/mine').then(function (response) {
        if (response.data.length > 0) {
          this.myQcollections = response.data
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
    createNewQcollection: function () {
      if (this.newQcollection.name) {
        this.$http.post('/api/manage-qcollection/qcollection', this.newQcollection).then(function (response) {
          this.showCreatSheet = false
          this.getMyQcollections()
        }, function (response) {
          console.log(response)
        })
      }
    },
    nextPage: function () {
      if (this.myQcollections.length > 0) {
        this.loadMore = false
        let latest_id = this.myQcollections[this.myQcollections.length - 1]._id
        console.log(latest_id)
        let apiURL = '/api/manage-qcollection/mine?page=' + latest_id
        this.$http.get(apiURL).then(function (response) {
          if (response.data.length > 0) {
            for (var i = 0; i < response.data.length; i++) {
              this.myQcollections.push(response.data[i])
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
      onlyShowPrivate: false,
      myQcollections: [],
      showCreatSheet: false,
      newQcollection: {
        name: '',
        subject: 'math',
        public: true
      },
      subjects: Subject.subjects,
      loadMore: true
    }
  }
}
</script>
