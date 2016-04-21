<style>
#quiz-results .main-wrapper {
  margin:16px auto;
  background: #fff;
  box-sizing: content-box;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35);
}
#quiz-results .qrcode-wrapper {
  width: 300px;
  height: 300px;
  margin: 0 auto
}

.latest-quiz .title {
  color: #3F51B5;
  padding-left: 16px;
}

.latest-quiz .time {
  padding-left: 16px;
  color: #616161;
  margin:8px 0
}

.latest-quiz .finished {
  padding-left: 16px;
  color: #009688;
  margin:8px 0
}

.latest-quiz .ongoing {
  padding-left: 16px;
  color: #E91E63;
  margin:8px 0
}

</style>
<template>
  <div id="quiz-results">
    <div style="padding-top:16px">
      <div class="main-wrapper flex-column">

        <div class="latest-quiz flex-row">

          <div class="flex-50" style="padding:0 16px">
            <div v-if="myQuickquizs[0]">
              <h4 style="color:#212121;padding-left:8px;margin-bottom:0;border-left: 8px solid #3F51B5;">最新測驗</h4>

              <h4 class="title">{{myQuickquizs[0].title}}</h4>

              <h6 class="time flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px">timer</i>{{myQuickquizs[0].time | quiztime}}</h6>
              <h6 class="finished flex-row" style="align-items:center"><i class="material-icons" style="margin-right:8px">create</i>{{myQuickquizs[0].finished | finished}}</h6>

              <div class="flex-column flex-start" style="padding-left: 16px;margin-top:16px">
                <mdl-button accent raised style="margin-bottom:8px" @click="endLatestQuickQuiz()">結束測驗</mdl-button>
                <mdl-button primary raised>查看詳情</mdl-button>
              </div>


            </div>
          </div>

          <div class="flex flex-50">
            <canvas id="qrcode-canvas" class="qrcode-wrapper"></canvas>
          </div>

        </div>

        <div class="all-quiz" style="border-top:1px solid #eee">
          all
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import qrcode from 'qrcode-canvas'
export default {
  ready () {
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

        this.$http.post('/api/manage-quickquiz/teacher/finish', data).then(function (response) {
          if (response.data.length > 0) {
            console.log(response.data)
            this.myQuickquizs = response.data
            this.generateLatestQuickQuizQrcode(response.data[0]._id)
          } else {
            // handle 0 quick-quiz view
          }
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
        return '進行中'
      } else {
        return '已結束'
      }
    },
    quiztime: function (value) {
      return value + '分鐘'
    }
  }
}
</script>
