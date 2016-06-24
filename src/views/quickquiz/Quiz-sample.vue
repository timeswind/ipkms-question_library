<style>
#quiz-sample .wrapper {
  margin: 16px;
}
</style>
<template>
  <div id="quiz-sample">
    <div class="wrapper flex-column">
      lllll
    </div>

  </div>
</template>

<script>
import Card from '../../components/reuseable/Card'
export default {
  attached: function () {
    if (this.$route.params.quizsample_id) {
      this.validateURL = true
      this.getQuizSample(this.$route.params.quizsample_id)
    }
  },
  components: {
    Card
  },
  methods: {
    getQuizSample: function (id) {
      // var apiURL = '/api/manage-quickquiz/quickquiz' + '?id=' + id
      // this.$http.get(apiURL).then(function (response) {
      //   console.log(response.data)
      //   this.quickquiz = response.data
      //   for (var i = 0; i < response.data.questions.length; i++) {
      //     this.correctAnswers.push(null)
      //     this.answers.push(null)
      //   }
      //   this.renderQuestions()
      // }, function (response) {
      //   console.log(response.data)
      // })
    }
  },
  data () {
    return {

    }
  }
}
</script>
