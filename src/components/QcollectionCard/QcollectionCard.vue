<template>
  <div class="qcollection-card">
    <router-link tag="div" :to="{ name: 'qcollection-detail', params: { qcollection_id: qcollection._id }}">
      <span class="subject">{{qcollection.subject | subject}}</span>
      <span class="public">{{qcollection.public | bTp}}</span>
      <span class="difficulty" v-if="qcollection.aveDifficulty">難度: {{qcollection.aveDifficulty}}</span>
      <p class="createdby" v-if="!mine && qcollection.createdBy && qcollection.createdBy.local && qcollection.createdBy.name">作者：<i>{{qcollection.createdBy.name}}</i></p>
      <p class="createdby" v-else></p>
      <p class="title">{{qcollection.name}}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'qcollection-card',
  props: {
    qcollection: {
      type: Object,
      default: {}
    },
    mine: {
      type: Boolean,
      default: false
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.qcollection-card {
  background-color: #fff;
  padding: 16px;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
  height: 100%;
  cursor: pointer;
}

.subject {
  background-color: #2196F3;
  color: #fff;
  padding: 4px 8px;
  border-radius: 14px;
  display: inline-block;
  margin-top: 3px;
}
.difficulty {
  color: #FF9800;
  margin-left: 5px;
}
.title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  padding-left: 12px;
  border-left: 4px solid #3F51B5;
}
.public {
  color: #E91E63;
  float: right;
  padding: 2px 4px;
  margin-top: 5px;
  border: 1px solid #E92266;
}
.createdby {
  font-size: 14px;
  font-weight: normal;
  color: #616161;
  margin-top: 16px;
  margin-bottom: 0;
  padding-left: 12px;
  border-left: 4px solid #3F51B5;
}
</style>
