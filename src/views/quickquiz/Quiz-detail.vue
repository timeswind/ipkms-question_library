<style>
#quiz-detail .wrapper {
  margin: 16px;
}

#quiz-detail .second-wrapper {
  background: #fff;
  margin-top: 16px;
}

#quiz-detail .quiz-title {
  margin:0 0 16px 0
}

#quiz-detail .quiz-starttime, #quiz-detail .quiz-finishtime {
  color: #9e9e9e;
  font-size: 14px
}

#quiz-detail .quiz-finished {
  margin-left: 8px;
  font-size: 18px;
  color: #FF9800
}

#quiz-detail .quiz-time {
  color: #2196F3;
  font-size: 18px;
  margin-left: 16px
}

#quiz-detail .quiz-time i{
  font-size: 18px;
  margin-right: 4px
}

#quiz-detail .quiz-questions-count {
  color: #2196F3;
  font-size: 18px;
  margin-left: auto;
}

#quiz-detail .quiz-questions-count i{
  font-size: 18px;
  margin-right: 4px
}
</style>
<template>
  <div id="quiz-detail">
    <div class="wrapper flex-column">
      <div class="flex-row">
        <mdl-button class="icon-left-button" raised primary @click="goBack()"><i class="material-icons">keyboard_arrow_left</i>返回</mdl-button>
        <mdl-button v-if="quickquiz.finished" style="margin-left:16px" raised><i class="material-icons" style="font-size:20px;margin-right:4px">redo</i>再測一次</mdl-button>
        <mdl-button v-if="!quickquiz.finished" style="margin-left:16px" raised accent @click="endQuiz()"><i class="material-icons" style="font-size:20px;margin-right:4px">gavel</i>結束小測</mdl-button>
        <mdl-button style="margin-left:16px" raised primary v-link="{'name': 'quiz-paper', params: { quickquiz_id: $route.params.quickquiz_id }}"><i class="material-icons" style="font-size:20px;margin-right:4px">description</i>查看试卷</mdl-button>

      </div>
      <div class="flex-column second-wrapper mdl-shadow--2dp">
        <div class="flex-column" style="padding:16px">

          <div class="flex-row flex-baseline">
            <h4 class="quiz-title">{{quickquiz.title}}</h4>
            <span class="quiz-finished">{{quickquiz.finished | finished}}</span>
            <span class="flex-row flex-center quiz-questions-count"><i class="material-icons">description</i><span>{{quickquiz.questions}}題</span></span>
            <span class="flex-row flex-center quiz-time"><i class="material-icons">timer</i><span>{{quickquiz.time}}分鐘</span></span>
          </div>
          <span class="quiz-starttime">開始於：{{quickquiz.startTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>
          <span class="quiz-finishtime">結束於：{{quickquiz.finishTime | date 'YYYY[年]M[月]DD[日] h:mm a'}}</span>

        </div>

        <div class="flex-column" v-if="quickquiz.students">
          <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">參與的學生</p>
          <div class="grids">
            <div class="grid-4" v-for="student in quickquiz.students" track-by="_id">
              {{student.name}}
            </div>
          </div>
          <p style="padding:16px 0 16px 0;margin:0;text-align:center;color:#607D8B">一共 {{quickquiz.students.length}} 位學生</p>
        </div>


        <div class="flex-column" v-if="quickquiz.finished">
          <p style="border-top:1px solid #eee;padding:8px 0 8px 0;margin:0;text-align:center;color:#aaa">數據 統計</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import qrcode from 'qrcode-canvas'
export default {
  attached: function () {
    if (this.$route.params.quickquiz_id) {
      this.validateURL = true
      this.getQuickquizDetail(this.$route.params.quickquiz_id)
    }
  },
  methods: {
    getQuickquizDetail: function (id) {
      let apiURL = '/api/manage-quickquiz/teacher/quickquiz/' + '?id=' + id
      this.$http.get(apiURL).then(function (response) {
        console.log(response.data)
        this.quickquiz = response.data
      }, function (response) {
        console.log(response.data)
      })
    },
    endQuiz: function () {
      if (this.quickquiz.finished === false) {
        let data = {
          quickquiz_id: this.quickquiz._id
        }
        this.$http.post('/api/manage-quickquiz/teacher/quickquiz/end', data).then(function (response) {
          this.quickquiz.finished = true
        }, function (response) {
          // handle errors
          console.log(response)
        })
      }
    },
    goBack: function () {
      window.history.back()
    }
  },
  data () {
    return {
      validateURL: false,
      quickquiz: {}
    }
  },
  filters: {
    finished: function (value) {
      if (value === false) {
        return '未收卷/進行中'
      } else {
        return '已結束'
      }
    }
  }
}
</script>
