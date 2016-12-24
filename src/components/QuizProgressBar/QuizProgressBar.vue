<template>
  <div class="progress-bar">
    <div class="correct progressBarSegment" :style="{ flex: correctFlex }"></div>
    <div class="incorrect progressBarSegment" :style="{ flex: incorrectFlex }"></div>
    <div class="unstarted progressBarSegment" :style="{ flex: unstartedFlex }"></div>
  </div>
</template>

<script>
export default {
  name: 'quiz-progress-bar',
  props: {
    incorrect: {
      type: Number,
      default: 0
    },
    unstarted: {
      type: Number,
      default: 1
    },
    correct: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  },
  computed: {
    correctFlex () {
      return (this.correct / (this.correct + this.incorrect + this.unstarted))
    },
    unstartedFlex () {
      return (this.unstarted / (this.correct + this.incorrect + this.unstarted))
    },
    incorrectFlex () {
      return (this.incorrect / (this.correct + this.incorrect + this.unstarted))
    }
  }
}
</script>
<style scoped>
.progress-bar {
  display: flex !important;
}
.progressBarSegment {
  display: flex !important;
  height: 6px !important;
}
.correct {
  background: #009688
}
.incorrect {
  background: #F44336
}
.unstarted {
  background: #eee
}
</style>
