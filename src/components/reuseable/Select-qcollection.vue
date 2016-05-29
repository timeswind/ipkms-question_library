<style>

@media screen and (max-width: 1024px) {
  #select-qcollection {
    box-sizing: border-box;
  }
}

@media screen and (min-width: 1025px) {
  #select-qcollection {
    box-sizing: border-box;
    padding-left: 240px
  }
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

#select-qcollection .modal-container {
  width: 300px;
  margin: 130px auto 0;
  padding: 0;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
}

.modal-header {
  padding: 20px 0px 0 20px;
  align-items: center
}

.modal-header h4 {
  margin: 0;
  color: #2196F3;
}

.modal-body {
  margin: 20px 0;
  margin-bottom: 0;
  max-height: 360px;
  overflow: scroll;
}

.modal-body::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
}
.modal-body::-webkit-scrollbar-thumb {
  border-radius: 0px;
  background-color: #ccc;
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

.modal-footer{
  padding-right: 20px;
  padding-bottom: 10px
}

.list {
  padding: 0px;
  list-style: none;
  margin:0
}
.list li {
  align-items: center;
  padding: 15px 20px;
  font-size: 16px;
  cursor: pointer;
  background-image: linear-gradient(to bottom, #9E9E9E 0%, #9E9E9E 51%, transparent 51%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.list li:active {
  background-color: #eee
}

.list .subject-label {
  color: #E91E63;
  border: 1px solid #E91E63;
  padding: 2px 4px;
  font-size: 13px;
  margin-right: 8px
}

</style>
<template>
  <div id="select-qcollection" class="modal-mask" v-show="show" transition="modal">
    <div class="modal-container">
      <div class="modal-header flex-row">
        <h4>加入題集</h4>
        <span class="flex" style="flex: 1"></span>
        <mdl-button class="close" @click="closeModal()">
          <i class="material-icons">close</i>
        </mdl-button>
      </div>
      <p style="text-align:center;margin:16px 0">
        <mdl-spinner :active="spinnerActive" v-show="spinnerActive"></mdl-spinner>
      </p>
      <div class="modal-body">
        <ul class="list">
          <li class="flex-row" v-for="qc in myQcollections" track-by="_id" @click="saveOneToCollection(qc._id)">
            <span class="subject-label">{{qc.subject | subject}}</span>
            <span>{{qc.name}}</span>
          </li>
        </ul>
        <div class="flex-column flex-center" style="margin:16px 0">
          <mdl-button raised primary @click="nextPage()" :disabled="!loadMore">加載更多</mdl-button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data () {
      return {
        spinnerActive: true,
        myQcollections: [],
        loadMore: false
      }
    },
    props: ['show', 'qid'],
    methods: {
      closeModal: function () {
        this.show = false
      },
      saveOneToCollection: function (qcollection_id) {
        if (qcollection_id && this.qid) {
          let data = {
            qcollection_id: qcollection_id,
            question_id: this.qid
          }
          this.$http.post('/api/manage-qcollection/add-question', data).then(function (response) {
            this.show = false
            this.$showToast('添加成功')
          }, function (response) {
            this.$showToast('失敗')
            console.log(response)
          })
        } else {
          this.$showToast('發生錯誤')
        }
      },
      getMyQcollectionLists: function () {
        if (this.myQcollections.length === 0) {
          this.$http.get('/api/manage-qcollection/mine').then(function (response) {
            this.spinnerActive = false
            if (response.data.length > 0) {
              this.myQcollections = response.data
              if (response.data.length < 12) {
                this.loadMore = false
              } else {
                this.loadMore = true
              }
            } else {
              this.loadMore = false
            }
          }, function (response) {
            this.spinnerActive = false
            this.loadMore = false
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
    watch: {
      'show': function (val, oldVal) {
        if (val === true && oldVal === false) {
          this.getMyQcollectionLists()
        }
      }
    }
  }
  </script>
