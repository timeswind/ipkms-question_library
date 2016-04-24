<style>
#prepare-quiz .main-wrapper{
  max-width: 800px;
  margin:0 auto;
  padding-top: 8px
}

#prepare-quiz .main-card {
  background-color: #fff;
  margin: 16px 8px 16px 8px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.35);
}

#prepare-quiz .qcollection-mini-card {
  border: 2px solid #E0E0E0;
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
}

#prepare-quiz .qcollection-mini-card:hover {
  background-color: #f7f7f7
}

#prepare-quiz .qcollection-mini-card:active {
  background-color: #eee
}

#prepare-quiz .qcollection-mini-card .name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #616161;
  font-size: 18px;
}

#prepare-quiz .qcollection-mini-card .subject {
  background-color: #03A9F4;
  color: #fff;
  padding: 2px 8px;
}

#prepare-quiz .qcollection-mini-card .difficulty {
  color: #FF9800;
  font-size: 13px;
  margin-left: 8px
}

#prepare-quiz .qrcode {
  width: 300px;
  height: 300px;
  margin: 0 auto
}
</style>
<template>
  <div id="prepare-quiz">
    <div class="main-wrapper">
      <div class="main-card flex-column">

        <div class="flex-row">
          <div class="flex-column flex-50">
            <mdl-textfield floating-label="小測名字" :value.sync="newQuickquiz.title"></mdl-textfield>
            <mdl-textfield floating-label="時長(分鐘)" :value.sync="newQuickquiz.time" type="number"></mdl-textfield>
            <div class="input-button-group">
              <i class="material-icons" style="margin-right:8px;color:#aaa">search</i>
              <mdl-textfield floating-label="搜索測驗題集" :value.sync="queryQcollection.keyword"></mdl-textfield>
              <mdl-button primary @click="queryQcollectionsByName()" :disabled="!queryQcollection.button">搜索</mdl-button>
            </div>
            <div class="flex-row" style="margin-bottom:16px">
              <mdl-radio style="margin-left:32px;" :checked.sync="queryQcollection.type" value="mine">我的題集</mdl-radio>
              <mdl-radio style="margin-left:16px;" :checked.sync="queryQcollection.type" value="all">公開題集</mdl-radio>
            </div>
            <div class="flex-column" v-show="newQuickquiz.qcollection._id">
              <h6 style="margin:0 0 4px 0;color:#E91E63">已選題集</h6>
              <div class="flex-column qcollection-mini-card"  style="max-width:300px;margin-bottom:16px;border-color:#E91E63">
                <span class="name">{{newQuickquiz.qcollection.name}}</span>
                <div class="flex-row" style="align-items: baseline">
                  <span class="subject">{{newQuickquiz.qcollection.subject | subject}}</span>
                  <span class="subject" style="background:#0277BD">{{newQuickquiz.qcollection.questions}} 題</span>
                  <span class="difficulty">难度 {{newQuickquiz.qcollection.aveDifficulty}}</span>
                </div>
              </div>
            </div>

          </div>

          <div class="flex-column flex-50" style="margin-bottom:16px">
            <div class="flex-row flex-center">
              <h4 v-show="queryQcollection.fail" class="display-1" style="margin-top: 0;margin-bottom:8px;color:#F44336">未找到題集</h4>
              <h4 v-show="!queryQcollection.fail" class="display-1" style="margin-top: 0;margin-bottom:8px">選擇題集</h4>
              <mdl-spinner v-show="queryQcollection.loading" :active="queryQcollection.loading"></mdl-spinner>
            </div>
            <div class="flex-column" v-show="!queryQcollection.fail">
              <div class="flex-column qcollection-mini-card" v-for="qcollection in queryQcollection.results" @click="newQuickquiz.qcollection = qcollection">
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
          <canvas id="qrcode-canvas" class="qrcode"></canvas>
          <p style="text-align:center">掃描二維碼進行答題</p>
        </div>
        <mdl-button primary raised @click="startQuickQuiz()" :disabled="!formCompletion && !submitButton">開始小測并生成 QR Code</mdl-button>
      </div>

    </div>
  </div>
</template>

<script>
import qrcode from 'qrcode-canvas'

export default {
  components: {
    qrcode
  },
  data () {
    return {
      newQuickquiz: {
        title: '',
        time: null,
        qcollection: {}
      },
      queryQcollection: {
        type: 'mine',
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
    queryQcollectionsByName: function () {
      this.queryQcollection.button = false
      if (this.queryQcollection.keyword.trim() !== '') {
        this.queryQcollection.loading = true
        let data = {
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
          // err handleing
          console.log(response.data)
        })
      } else {
        this.queryQcollection.loading = false
        this.queryQcollection.button = true
      }
    },
    startQuickQuiz: function () {
      if (this.formCompletion) {
        this.submitButton = false
        let data = {
          title: this.newQuickquiz.title,
          time: this.newQuickquiz.time,
          qcollection_id: this.newQuickquiz.qcollection._id
        }

        this.$http.post('/api/manage-quickquiz/teacher/quickquizs', data).then(function (response) {
          this.newQuickquiz.title = ''
          this.newQuickquiz.time = null
          this.newQuickquiz.qcollection = {}
          this.queryQcollection.type = 'mine'
          this.queryQcollection.results = []
          this.queryQcollection.keyword = ''
          this.queryQcollection.button = true
          this.queryQcollection.fail = false

          let qrcodeData = {
            type: 'quickquiz',
            id: response.data
          }

          var self = this

          var qrcodedraw = new qrcode.QRCodeDraw()
          qrcodedraw.draw(document.getElementById('qrcode-canvas'), JSON.stringify(qrcodeData), {scale: 10}, function (error, canvas) {
            if (error) {
              return console.log('Error =( ', error)
            } else {
              self.qrcode = true
            }
          })
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
    }
  }

}
</script>
