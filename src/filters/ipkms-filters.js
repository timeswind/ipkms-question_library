import Subjects from '../modules/Subjects'
import moment from 'moment'

module.exports = {
  install: function (Vue, options) {
    Vue.filter('subject', function (id) {
      var array = Subjects.subjects
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === id) {
          return array[i].name
        }
      }
    })

    Vue.filter('bTp', function (boolean) {
      if (boolean) {
        return '公開'
      } else {
        return '私有'
      }
    })

    Vue.filter('bTw', function (boolean) {
      if (boolean) {
        return '是'
      } else {
        return '否'
      }
    })

    Vue.filter('finished', function (boolean) {
      if (boolean === false) {
        return '未收卷'
      } else {
        return '已結束'
      }
    })

    Vue.filter('date', function (value, formate) {
      return moment(value).format(formate)
    })

    Vue.filter('calendar', function (value, formate) {
      moment.locale('zh-tw')
      return moment(value).calendar()
    })
  }
}
