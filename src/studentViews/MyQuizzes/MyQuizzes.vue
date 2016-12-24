<template>
  <div>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="all-quizzes" title="我的小測"/>
      <mu-tab value="my-reports" title="測驗報告"/>
    </mu-tabs>
    <div v-if="activeTab === 'all-quizzes'">
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(sample, index) in quizsamples" :key="sample._id">
          <!-- <quickquiz-card :quickquiz="quickquiz" style="margin: 8px"/> -->
        </mu-col>
      </mu-row>
    </div>
    <div v-if="activeTab === 'my-reports'">
      測驗報告
    </div>
  </div>
</template>

<script>
// import qrcode from 'qrcode-canvas'
// import QuickquizCard from '../../components/QuickquizCard/QuickquizCard'
export default {
  components: {
    // 'quickquiz-card': QuickquizCard
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getMyQuickquizzes()
    })
  },
  data () {
    return {
      activeTab: 'all-quizzes',
      quizsamples: []
    }
  },
  methods: {
    getMyQuickquizzes () {
      this.$http.get('/api/manage-quickquiz/student/quickquizs').then(function (response) {
        if (response.data.success && response.data.quizsamples) {
          this.quizsamples = response.data.quizsamples
        }
      }, function (response) {
        console.log(response)
      })
    },
    handleTabChange (tab) {
      if (tab === 'all-quizzes') {
        this.getMyQuickquizzes()
      } else if (tab === 'my-reports') {

      }
      this.activeTab = tab
    }
  },
  computed: {
    subjects: function () {
      return this.$store.getters.getSubjects
    }
  }
}
</script>
<style scoped>

</style>
