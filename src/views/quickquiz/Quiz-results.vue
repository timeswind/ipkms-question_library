<style>
#quiz-results .main-wrapper {
  margin:16px auto;
  box-sizing: content-box;
}
#quiz-results .qrcode-wrapper {
  width: 300px;
  height: 300px;
  margin: 0 auto
}

.latest-quiz .title {
  color: #3F51B5;
  padding-left: 16px;
  margin: 16px 0 8px 0
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

.quickquiz-card {
  cursor: pointer;
  padding: 16px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.quickquiz-card:active {
  background: #eeeeee
}

.quickquiz-card .title {
  color: #212121;
  font-size: 20px
}

.quickquiz-card .finished {
  color: #FF9800;
  font-size: 13px;
  padding-left: 8px
}

.quickquiz-card .time {
  color: #616161;
  font-size: 13px;
}

.quickquiz-card .date {
  color: #999999;
  font-size: 13px
}
</style>
<template>
  <div id="quiz-results">
    <div style="padding-top:16px">
      <div class="main-wrapper flex-column" style="background-color:#fff;box-shadow: 0 1px 6px rgba(0,0,0,0.35);">
        <p style="border-bottom:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">最新小測</p>

        <div class="latest-quiz flex-row">

          <div class="flex-50" style="padding:16px 0 0 16px">
            <div v-if="myQuickquizs[0]" class="flex-column">
              <h4 class="title">{{myQuickquizs[0].title}}</h4>
              <h6 class="time flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px;font-size:20px">timer</i>{{myQuickquizs[0].time}}分鐘</h6>
              <h6 class="finished flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px;font-size:20px">create</i>{{myQuickquizs[0].finished | finished}}</h6>
              <span class="startTime">開始於: {{myQuickquizs[0].startTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>
              <span class="finishTime" v-if="myQuickquizs[0].finishTime">結束于: {{myQuickquizs[0].finishTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>
              <div class="flex-column flex-start" style="margin:16px 0 16px 16px">
                <mdl-button accent raised style="margin-bottom:8px" @click="endLatestQuickQuiz()" v-show="!myQuickquizs[0].finished">結束測驗</mdl-button>
                <mdl-button primary raised v-link="{ name: 'quiz-detail', params: { quickquiz_id: myQuickquizs[0]._id }}">查看詳情</mdl-button>
              </div>
            </div>
          </div>

          <div class="flex flex-50">
            <canvas id="qrcode-canvas" class="qrcode-wrapper"></canvas>
          </div>

        </div>
      </div>
      <div>
        <div class="mdl-grid">
          <div class="mdl-cell mdl-cell--4-col quickquiz-card flex-column" v-for="quickquiz in myQuickquizs" track-by="_id" v-link="{ name: 'quiz-detail', params: { quickquiz_id: quickquiz._id }}">
            <div class="flex-row flex-baseline">
              <span class="title">{{quickquiz.title}}</span>
              <span class="finished">{{quickquiz.finished | finished}}</span>

            </div>
            <span class="time">{{quickquiz.time}}分鐘</span>

            <span class="date">{{quickquiz.startTime | date 'YY[年]M[月]DD[日]'}}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import qrcode from 'qrcode-canvas'
export default {
  attached () {
    this.getMyQuickQuizs()
  },
  data () {
    return {
      myQuickquizs: []
    }
  },
  components: {

  },
  methods: {
    getMyQuickQuizs: function () {
      this.$http.get('/api/manage-quickquiz/teacher/quickquizs').then(function (response) {
        if (response.data.length > 0) {
          this.myQuickquizs = response.data
          this.generateLatestQuickQuizQrcode(response.data[0]._id)
        } else {
          // handle 0 quick-quiz view
        }
      }, function (response) {
        // handle errors
        console.log(response)
      })
    },
    generateLatestQuickQuizQrcode: function (quickquiz_id) {
      let qrcodeData = {
        type: 'quickquiz',
        id: quickquiz_id
      }

      var qrcodedraw = new qrcode.QRCodeDraw()
      qrcodedraw.draw(document.getElementById('qrcode-canvas'), JSON.stringify(qrcodeData), {scale: 10}, function (error, canvas) {
        if (error) {
          return console.log('Error =( ', error)
        }
      })
    },
    endLatestQuickQuiz: function () {
      if (this.myQuickquizs[0].finished === false) {
        let data = {
          quickquiz_id: this.myQuickquizs[0]._id
        }
        this.$http.post('/api/manage-quickquiz/teacher/quickquiz/end', data).then(function (response) {
          this.myQuickquizs[0].finished = true
        }, function (response) {
          // handle errors
          console.log(response)
        })
      }
    }
  },
  filters: {
    finished: function (value) {
      if (value === false) {
        return '未收卷'
      } else {
        return '已結束'
      }
    }
  }
}
</script>
