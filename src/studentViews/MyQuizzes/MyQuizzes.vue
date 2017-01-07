<template>
  <div>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="all-quizzes" title="我的小測"/>
      <mu-tab value="my-reports" title="測驗報告"/>
    </mu-tabs>
    <div v-if="activeTab === 'all-quizzes'">
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(sample, index) in quizsamples" :key="sample._id">
          <quizsample-card :quizsample="sample" style="margin: 8px"/>
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
import QuizsampleCard from '../../components/QuizsampleCard/QuizsampleCard'
export default {
  components: {
    'quizsample-card': QuizsampleCard
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
      this.$http.get('/api/quizsamples').then(function (response) {
        if (response.data.success && response.data.quizsamples) {
          this.quizsamples = response.data.quizsamples.map((sample) => {
            if (sample.quickquiz && sample.quickquiz.endAt && new Date() > new Date(sample.quickquiz.endAt)) {
              sample.quickquiz.finished = true
              if (sample.finishAt && new Date(sample.finishAt) > new Date(sample.quickquiz.endAt)) {
                sample.overtime = true
              } else {
                sample.overtime = false
              }
            } else {
              sample.quickquiz.finished = false
            }
            return sample
          })
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
