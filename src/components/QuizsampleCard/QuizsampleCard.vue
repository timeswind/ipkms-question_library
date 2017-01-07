<template>
  <div class="quizsample-card">
    <router-link tag="div" :to="{name: 'student-quiz', params: {quiz_id: quizsample.quickquiz._id}}">
      <div class="flex-row flex-baseline">
        <span class="title">{{quizsample.quickquiz.title}}</span>
        <span class="finished">{{quizsample.finishAt ? '已上交' : '未上交'}}</span>
        <span :class="quizsample.quickquiz.finished ? 'quiz-finished' : 'quiz-undergoing'">{{quizsample.quickquiz.finished ? '已結束' : '進行中'}}</span>
      </div>
      <span class="time">{{quizsample.quickquiz.duration}}分鐘</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'quicksample-card',
  props: {
    quizsample: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style scoped>
.quizsample-card {
  cursor: pointer;
  padding: 16px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.quiz-card:active {
  background: #eeeeee
}

.title {
  color: #212121;
  font-size: 20px
}

.finished {
  margin-left: auto;
  color: #FF9800;
  font-size: 13px;
  padding-left: 8px
}

.time {
  color: #616161;
  font-size: 13px;
}

.date {
  color: #999999;
  font-size: 13px
}

.quiz-finished {
  color: #009688;
  font-size: 13px;
  padding-left: 8px
}

.quiz-undergoing {
  color: #3f51b5;
  font-size: 13px;
  padding-left: 8px
}
</style>
