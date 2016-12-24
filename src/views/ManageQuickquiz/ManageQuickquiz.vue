<template>
  <div id="manage-quickquiz">
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="all-quizzes" title="所有小測"/>
      <mu-tab value="prepare-quiz" title="準備小測"/>
    </mu-tabs>
    <div v-if="activeTab === 'all-quizzes'">
      <div class="latest-quiz light-card default-pending" v-show="!!quickquizzes[0]">
        <mu-row>
          <mu-col width="100" tablet="50" desktop="50">
            <div v-if="quickquizzes[0]" class="flex-column">
              <h1 class="title">{{quickquizzes[0].title}}</h1>
              <h3 class="time flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px;font-size:20px">timer</i>{{quickquizzes[0].time}}分鐘</h3>
              <h3 class="finished flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px;font-size:20px">create</i>{{quickquizzes[0].endAt ? '已結束' : '進行中'}}</h3>
              <span class="startTime">開始於: {{quickquizzes[0].startTime | date('YYYY[年]M[月]DD[日] h:mm a')}}</span>
              <span class="finishTime" v-if="quickquizzes[0].finishTime">結束于: {{quickquizzes[0].finishTime | date('YYYY[年]M[月]DD[日], h:mm, a')}}</span>
              <div class="flex-column flex-start" style="margin:16px 0 16px 16px">
                <mu-raised-button label="結束測驗" primary style="margin-bottom:8px" @click="endLatestQuickQuiz()" v-show="!quickquizzes[0].finished"/>
                <mu-raised-button label="查看詳情" primary raised @click="$router.push({ name: 'quiz-detail', params: { quickquiz_id: quickquizzes[0]._id }})" />
              </div>
            </div>
          </mu-col>
          <mu-col width="100" tablet="50" desktop="50">
            <canvas id="qrcode-canvas" class="qrcode-wrapper"></canvas>
          </mu-col>
        </mu-row>
      </div>
      <mu-row>
        <mu-col width="100" tablet="50" desktop="33" v-for="(quickquiz, index) in quickquizzes" :key="quickquiz._id">
          <quickquiz-card :quickquiz="quickquiz" style="margin: 8px"/>
        </mu-col>
      </mu-row>
    </div>
    <div v-if="activeTab === 'prepare-quiz'">
      <div class="main-card flex-column" v-show="true">
        <div class="flex-row">
          <div class="flex-column flex-50">
            <mu-text-field hintText="小測名字" v-model="newQuickquiz.title"></mu-text-field>
            <mu-text-field hintText="時長(分鐘)" v-model="newQuickquiz.time" type="number"></mu-text-field>
            <mu-select-field v-model="queryQcollection.subject" label="科目">
              <mu-menu-item v-for="subject in subjects" :value="subject.id" :title="subject.name"/>
            </mu-select-field>
            <div class="input-button-group">
              <i class="material-icons" style="margin-right:8px;color:#aaa">search</i>
              <mu-text-field hintText="搜索測驗題集" v-model="queryQcollection.keyword"></mu-text-field>
              <mu-raised-button label="搜索" primary @click.native="queryQcollectionsByName()" :disabled="!queryQcollection.button" style="margin: 0 0 8px 16px"/>
            </div>
            <div class="flex-row" style="margin-bottom:16px">
              <mu-radio label="我的題集" name="qcollectiontype" nativeValue="mine" v-model="queryQcollection.type"/>
              <mu-radio label="公開題集" name="qcollectiontype" nativeValue="all" v-model="queryQcollection.type" style="margin-left: 16px"/>
            </div>

          </div>

          <div class="flex-column flex-50" style="margin-bottom:16px">
            <div class="flex-column" v-show="newQuickquiz.qcollection._id">
              <h4 class="display-1" style="margin:0 0 4px 0;color:#E91E63">已選題集</h4>
              <div class="flex-column qcollection-mini-card"  style="margin-bottom:16px;border-color:#E91E63">
                <span class="name">{{newQuickquiz.qcollection.name}}</span>
                <div class="flex-row" style="align-items: baseline">
                  <span class="subject">{{newQuickquiz.qcollection.subject | subject}}</span>
                  <span class="subject" style="background:#0277BD">{{newQuickquiz.qcollection.questions}} 題</span>
                  <span class="difficulty">难度 {{newQuickquiz.qcollection.aveDifficulty}}</span>
                </div>
              </div>
            </div>
            <div class="flex-row flex-center">
              <h4 v-show="queryQcollection.fail" class="display-1" style="margin-top: 0;margin-bottom:8px;color:#F44336">未找到題集</h4>
              <h4 v-show="!queryQcollection.fail" class="display-1" style="margin-top: 0;margin-bottom:8px">選擇題集</h4>
              <mu-circular-progress v-show="queryQcollection.loading" :size="40"/>
            </div>
            <div class="flex-column" v-show="!queryQcollection.fail">
              <div class="flex-column qcollection-mini-card" v-for="(qcollection, index) in queryQcollection.results" @click="handleQcollectionSelect(index)">
                <span class="name">{{qcollection.name}}</span>
                <div class="flex-row" style="align-items: baseline">
                  <span class="subject">{{qcollection.subject | subject}}</span>
                  <span class="subject" style="background:#0277BD">{{qcollection.questions}} 題</span>
                  <span class="difficulty">难度 {{qcollection.aveDifficulty}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-column" v-show="qrcode">
          <canvas id="qrcode-canvas-2" class="qrcode-2"></canvas>
          <p style="text-align:center">掃描二維碼進行答題</p>
        </div>
        <mu-raised-button label="開始小測并生成 QR Code" primary @click.native="startQuickQuiz()" :disabled="!formCompletion && !submitButton"/>
      </div>
    </div>
  </div>
</template>

<script>
import qrcode from 'qrcode-canvas'
import QuickquizCard from '../../components/QuickquizCard/QuickquizCard'
export default {
  components: {
    'quickquiz-card': QuickquizCard
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getMyQuickquizzes()
    })
  },
  data () {
    return {
      activeTab: 'all-quizzes',
      quickquizzes: [],
      newQuickquiz: {
        title: '',
        time: null,
        qcollection: {}
      },
      queryQcollection: {
        type: 'mine',
        subject: 'math',
        keyword: '',
        loading: false,
        button: true,
        fail: false,
        results: []
      },
      submitButton: true,
      qrcode: false
    }
  },
  methods: {
    handleQcollectionSelect (index) {
      let qcollection = this.queryQcollection.results[index]
      this.newQuickquiz.qcollection = qcollection
      this.queryQcollection.subject = qcollection.subject
    },
    getMyQuickquizzes () {
      this.$http.get('/api/manage-quickquiz/teacher/quickquizs').then(function (response) {
        if (response.data.length > 0) {
          this.quickquizzes = response.data
          this.generateLatestQuickQuizQrcode(response.data[0]._id)
        } else {
          // handle 0 quick-quiz view
        }
      }, function (response) {
        console.log(response)
      })
    },
    generateLatestQuickQuizQrcode: function (quickquiz_id) {
      let qrcodeData = 'quickquiz' + '|' + quickquiz_id
      var qrcodedraw = new qrcode.QRCodeDraw()
      qrcodedraw.draw(document.getElementById('qrcode-canvas'), qrcodeData, {scale: 10}, function (error, canvas) {
        if (error) {
          return console.log('Error =( ', error)
        }
      })
    },
    handleTabChange (tab) {
      if (tab === 'all-quizzes') {
        this.getMyQuickquizzes()
      } else if (tab === 'prepare-quiz') {

      }
      this.activeTab = tab
    },
    queryQcollectionsByName: function () {
      this.queryQcollection.button = false
      if (this.queryQcollection.keyword.trim() !== '') {
        this.queryQcollection.loading = true
        let data = {
          subject: this.queryQcollection.subject,
          type: this.queryQcollection.type,
          name: this.queryQcollection.keyword
        }
        this.$http.post('/api/manage-qcollection/teacher/query/name', data).then(function (response) {
          this.queryQcollection.loading = false
          this.queryQcollection.button = true
          if (response.data && response.data.length > 0) {
            // show qcollection result modal
            this.queryQcollection.results = response.data
            this.queryQcollection.fail = false
          } else {
            // not found
            this.queryQcollection.fail = true
          }
        }, function (response) {
          this.queryQcollection.button = true
          this.queryQcollection.loading = false
          console.log(response.data)
        })
      } else {
        this.queryQcollection.loading = false
        this.queryQcollection.button = true
      }
    },
    startQuickQuiz: function () {
      var self = this

      if (this.formCompletion) {
        this.submitButton = false
        let data = {
          title: this.newQuickquiz.title,
          time: this.newQuickquiz.time,
          subject: this.queryQcollection.subject,
          qcollection_id: this.newQuickquiz.qcollection._id
        }

        this.$http.post('/api/manage-quickquiz/teacher/quickquizs', data).then(function (response) {
          if (response.data.success && response.data.id) {
            let quickquiz_id = response.data.id
            this.newQuickquiz.title = ''
            this.newQuickquiz.time = null
            this.newQuickquiz.qcollection = {}
            this.queryQcollection.type = 'mine'
            this.queryQcollection.results = []
            this.queryQcollection.keyword = ''
            this.queryQcollection.button = true
            this.queryQcollection.fail = false

            let qrcodeData = 'quickquiz' + '|' + quickquiz_id

            var qrcodedraw = new qrcode.QRCodeDraw()
            qrcodedraw.draw(document.getElementById('qrcode-canvas-2'), qrcodeData, {scale: 10}, function (error, canvas) {
              if (error) {
                return console.log('Error =( ', error)
              } else {
                self.qrcode = true
              }
            })
          }
        }, function (response) {
          this.submitButton = true
          console.log(response.data)
        })
      }
    }
  },
  computed: {
    formCompletion: function () {
      return (this.newQuickquiz.title.trim() !== '' && this.newQuickquiz.time > 0 && this.newQuickquiz.qcollection._id)
    },
    subjects: function () {
      return this.$store.getters.getSubjects
    }
  }
}
</script>
<style scoped>
.latest-quiz {
  max-width: 800px;
  margin: 8px auto
}
.latest-quiz .title {
  color: #3F51B5;
  padding-left: 16px;
  margin: 16px 0 8px 0;
  max-width: 800px
}

.latest-quiz .time {
  padding-left: 16px;
  color: #616161;
  margin: 0 0 8px 0
}

.latest-quiz .startTime, .latest-quiz .finishTime {
  padding-left: 16px;
  color: #9e9e9e
}

.latest-quiz .finished {
  padding-left: 16px;
  color: #009688;
  margin: 0 0 8px 0
}

.latest-quiz .ongoing {
  padding-left: 16px;
  color: #E91E63;
  margin: 0 0 8px 0
}

.qrcode-wrapper {
  width: 300px;
  height: 300px;
  margin: 0 auto
}

.main-wrapper{
  max-width: 800px;
  margin:0 auto;
  padding-top: 8px
}

.main-card {
  background-color: #fff;
  margin: 16px auto;
  padding: 16px;
  max-width: 800px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
  border: 1px solid rgba(0, 0, 0, .09);
}

.qcollection-mini-card {
  border: 2px solid #E0E0E0;
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
}

.qcollection-mini-card:hover {
  background-color: #f7f7f7
}

.qcollection-mini-card:active {
  background-color: #eee
}

.qcollection-mini-card .name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #616161;
  font-size: 18px;
}

.qcollection-mini-card .subject {
  background-color: #03A9F4;
  color: #fff;
  padding: 2px 8px;
}

.qcollection-mini-card .difficulty {
  color: #FF9800;
  font-size: 13px;
  margin-left: 8px
}

.qrcode-2 {
  width: 300px;
  height: 300px;
  margin: 0 auto
}
</style>
