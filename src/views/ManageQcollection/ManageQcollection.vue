<template>
  <div id="manage-question">
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="my-qcollections" title="我的題集"/>
      <mu-tab value="all-qcollections" title="所有題集"/>
      <mu-tab value="search-qcollections" title="搜索題集"/>
    </mu-tabs>
    <div v-if="activeTab === 'my-qcollections'">
      <mu-raised-button primary @click="newQcollectionDialogOpen = true" label="創建新題集" style="margin: 16px 8px 8px 8px"/>
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(qcollection, index) in qcollections">
          <qcollection-card mine :qcollection="qcollection" style="margin: 8px"/>
        </mu-col>
      </mu-row>
    </div>
    <div v-if="activeTab === 'all-qcollections'">
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(qcollection, index) in qcollections">
          <qcollection-card :qcollection="qcollection" style="margin: 8px"/>
        </mu-col>
      </mu-row>
    </div>
    <div v-if="activeTab === 'search-qcollections'">
      <div class="search-zone">
        <div class="flex-column" style="max-width: 400px;margin: 0 auto">
          <div class="flex-row">
            <div class="flex-column flex-50">
              <span class="field-title">題集名字</span>
              <mu-text-field hintText="題集名字" v-model="search.name" style="position: relative;top: -7px;width: 90%;"></mu-text-field>
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
            <mu-raised-button primary label="搜索" @click="query" :disabled="search.buttonDisable"/>
          </div>
        </div>

      </div>
      <div class="result-zone">
        <mu-row>
          <mu-col width="100" tablet="50" desktop="33" v-for="(qcollection, index) in qcollections">
            <qcollection-card :qcollection="qcollection" style="margin: 8px"/>
          </mu-col>
        </mu-row>
      </div>
    </div>
    <mu-dialog :open="newQcollectionDialogOpen" title="創建新題集" @close="closeNewCollectionDialog">
      <div class="block">
        <mu-text-field hintText="題集名字" v-model="newQcollection.name"></mu-text-field>
      </div>
      <div class="block">
        科目：
        <select v-model="newQcollection.subject">
          <option v-for="subject in subjects" v-bind:value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>
      <mu-text-field hintText="描述" multiLine :rows="3" :rowsMax="6" v-model="newQcollection.description"></mu-text-field>
      <div class="block" style="padding:20px 0">
        <mu-checkbox label="公開" v-model="newQcollection.public"/>
      </div>
      <mu-flat-button slot="actions" label="取消" @click="closeNewCollectionDialog"/>
      <mu-raised-button primary slot="actions" label="創建" @click="createNewQcollection"/>
    </mu-dialog>
  </div>
</template>

<script>
import QcollectionCard from '../../components/QcollectionCard/QcollectionCard.vue'
export default {
  mounted: function () {
    this.$nextTick(function () {
      this.getMyQcollections()
    })
  },
  data () {
    return {
      activeTab: 'my-qcollections',
      qcollections: [],
      loadMore: false,
      newQcollectionDialogOpen: false,
      newQcollection: {
        name: '',
        subject: 'math',
        description: '',
        public: true
      },
      search: {
        buttonDisable: false,
        name: '',
        subject: '',
        options: {}
      }
    }
  },
  computed: {
    subjects () {
      return this.$store.getters.getSubjects
    }
  },
  components: {
    'qcollection-card': QcollectionCard
  },
  methods: {
    getMyQcollections () {
      this.$http.get('/api/manage-qcollection/qcollections/mine').then(function (response) {
        if (response.data.length > 0) {
          this.qcollections = response.data
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
    getAllQcollections () {
      this.$http.get('/api/manage-qcollection/qcollections/all').then(function (response) {
        if (response.data.length > 0) {
          this.qcollections = response.data
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
    query () {
      if (this.search.name.trim() !== '' && this.search.subject.trim() !== '') {
        this.search.buttonDisable = true
        let data = {
          name: this.search.name,
          subject: this.search.subject
        }
        this.$http.post('/api/manage-qcollection/query', data).then(function (response) {
          this.qcollections = response.data
          this.search.buttonDisable = false
        }, function (response) {
          this.search.buttonDisable = false
        })
      }
    },
    createNewQcollection () {
      if (this.newQcollection.name) {
        this.$http.post('/api/manage-qcollection/qcollection', this.newQcollection).then(function (response) {
          this.newQcollectionDialogOpen = false
          this.getMyQcollections()
          this.$showToast('創建成功')
        }, function (response) {
          console.log(response)
        })
      }
    },
    closeNewCollectionDialog () {
      this.newQcollectionDialogOpen = false
    },
    handleTabChange (val) {
      this.questions = []
      if (val === 'my-qcollections') {
        this.getMyQcollections()
      } else if (val === 'all-qcollections') {
        this.getAllQcollections()
      } else if (val === 'search-qcollections') {
        this.qcollections = []
      }
      this.activeTab = val
    }
  }
}
</script>
<style scoped>
.search-zone {
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  padding: 32px 16px;
}
</style>
