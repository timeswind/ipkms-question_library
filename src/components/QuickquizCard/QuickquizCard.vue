<template>
  <div class="quiz-card">
    <router-link tag="div" :to="{ name: 'quiz-detail', params: { quickquiz_id: quickquiz._id }}">
      <div class="flex-row flex-baseline">
        <span class="title">{{quickquiz.title}}</span>
        <span class="finished">{{quickquiz.endAt ? '已結束' : '進行中'}}</span>
      </div>
      <span class="time">{{quickquiz.time}}分鐘</span>

      <span class="date">{{quickquiz.startTime | date('YY[年]M[月]DD[日]')}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'quickquiz-card',
  props: {
    quickquiz: {
      type: Object,
      default: {}
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.quiz-card {
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
</style>
