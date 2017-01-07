<template>
  <div class="quiz-report">
    <mu-row>
      <mu-col width="50" tablet="33" desktop="33" v-for="(report, index) in modifiedReport">
        <div class="flex-column report-slot">
          <span class="report-key">{{report.key}}</span>
          <span class="report-data">{{report.data}}</span>
        </div>
      </mu-col>
      <mu-col width="50" tablet="33" desktop="33">
        <div class="flex-column report-slot" v-if="finishAt !== null">
          <span class="report-key">上交時間</span>
          <span class="report-data">{{finishAt | date('YYYY[/]M[/]DD H:mm')}}</span>
        </div>
      </mu-col>
      <mu-col width="50" tablet="33" desktop="33">
        <div class="flex-column report-slot" v-if="score !== null">
          <span class="report-score-key">評分</span>
          <span class="report-score-data">{{score}}</span>
        </div>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
// import deltaRender from '../../modules/delta-render'

export default {
  name: 'quiz-report',
  props: {
    report: {
      type: Array,
      default: function () {
        return []
      }
    },
    score: {
      type: Number,
      default: null
    },
    finishAt: {
      type: String,
      default: null
    }
  },
  data () {
    var reportDicTWCHI = {
      'unstartCount': '未完成',
      'incorrectCount': '錯誤',
      'correctCount': '正確',
      'onTime': '按時上交'
    }
    var modifiedReport = []
    if (this.report && this.report.length > 0) {
      this.report.forEach((data) => {
        if (reportDicTWCHI[data.key]) {
          if (data.key === 'onTime') {
            if (data.data === 'true') {
              modifiedReport.push({
                key: reportDicTWCHI[data.key],
                data: '是'
              })
            } else {
              modifiedReport.push({
                key: reportDicTWCHI[data.key],
                data: '否'
              })
            }
          } else {
            modifiedReport.push({
              key: reportDicTWCHI[data.key],
              data: data.data
            })
          }
        }
      })
    }
    return {
      modifiedReport: modifiedReport
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // this.restoreAnswer()
    })
  },
  methods: {
    modifyReport (report) {
      var reportDicTWCHI = {
        'unstartCount': '未完成',
        'incorrectCount': '錯誤',
        'correctCount': '正確',
        'onTime': '按時上交'
      }
      var modifiedReport = []
      if (report && report.length > 0) {
        report.forEach((data) => {
          if (reportDicTWCHI[data.key]) {
            if (data.key === 'onTime') {
              if (data.data === 'true') {
                modifiedReport.push({
                  key: reportDicTWCHI[data.key],
                  data: '是'
                })
              } else {
                modifiedReport.push({
                  key: reportDicTWCHI[data.key],
                  data: '否'
                })
              }
            } else {
              modifiedReport.push({
                key: reportDicTWCHI[data.key],
                data: data.data
              })
            }
          }
        })
      }
      this.modifiedReport = modifiedReport
    }
  },
  watch: {
    report (value) {
      this.modifyReport(value)
    }
  }
}
</script>
<style scoped>
.report-slot {
  padding: 16px
}
.report-key {
  color: #757575;
  font-size: 15px;
}
.report-data {
  color: #37474f;
  font-size: 18px
}
.report-score-key {
  color: #D32F2F;
  font-size: 15px;
}
.report-score-data {
  color: #D32F2F;
  font-size: 18px;
}
</style>
