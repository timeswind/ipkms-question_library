<style>
* {
  box-sizing: border-box;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
}

.modal-container {
  width: 300px;
  margin: 100px auto 0;
  padding: 0;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-header {
  padding: 20px 0px 0 20px;
}

.modal-header h4 {
  margin-top: 0;
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

.text-right {
  text-align: right;
}

.form-label {
  display: block;
  margin-bottom: 1em;
}

.form-label > .form-control {
  margin-top: 0.5em;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5em 1em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.list {
  padding: 0px;
  list-style: none;
  margin:0
}
.list li {
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

.list span {
  color: #E91E63;
  border: 1px solid #E91E63;
  padding: 2px 4px;
  font-size: 13px;
}

.close {
  float: right;
}

</style>
<template>
  <div class="modal-mask" v-show="show" transition="modal">
    <div class="modal-container">
      <div class="modal-header">
        <h4>
          加入題集
          <mdl-button class="close" @click="closeModal()">
            <i class="material-icons">close</i>
          </mdl-button>
        </h4>

        <!-- <p>id:{{qid}}</p> -->
      </div>
      <mdl-spinner :active="spinnerActive" v-show="spinnerActive"></mdl-spinner>
      <div class="modal-body">
        <ul class="list">
          <li v-for="qc in myQcollections" @click="saveOneToCollection(qc._id)">
            <span>{{idToName(qc.subject)}}</span> {{qc.name}}
          </li>
        </ul>
      </div>

      <!-- <div class="modal-footer text-right">
      <mdl-button class="modal-default-button" @click="savePost()">
      加入
    </mdl-button>
  </div> -->
</div>
</div>
</template>

<script>
import vmdl from 'vue-mdl'
import Vue from 'vue'

vmdl.register(Vue, 'mdlCheckbox')
vmdl.register(Vue, 'mdlButton')
vmdl.register(Vue, 'mdlSpinner')

var checkbox = vmdl.components['mdlCheckbox']
var button = vmdl.components['mdlButton']
var spinner = vmdl.components['mdlSpinner']

export default {
  components: {
    mdlButton: button,
    mdlCheckbox: checkbox,
    mdlSpinner: spinner
  },
  data () {
    return {
      spinnerActive: true,
      myQcollections: [],
      subjects: [
        { name: '數學', id: 'math' },
        { name: '物理', id: 'phy' }
      ]
    }
  },
  props: ['show', 'qid'],
  methods: {
    closeModal: function () {
      this.show = false
    },
    saveOneToCollection: function (qcollection_id) {
      let data = {
        qcollection_id: qcollection_id,
        question_id: this.qid
      }
      this.$http.post('/api/manage-qcollection/add-question', data).then(function (response) {
        this.show = false
      }, function (response) {
        console.log(response)
      })
    },
    getMyQcollectionLists: function () {
      if (this.myQcollections.length === 0) {
        this.$http.get('/api/manage-qcollection/mine').then(function (response) {
          this.myQcollections = response.data
          this.spinnerActive = false
        }, function (response) {
          console.log(response)
        })
      }
    },
    idToName: function (id) {
      var array = this.subjects
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return array[i].name
        }
      }
    }
  },
  events: {
    'getMyQcollectionLists': function () {
      this.getMyQcollectionLists()
    }
  }
}
</script>
