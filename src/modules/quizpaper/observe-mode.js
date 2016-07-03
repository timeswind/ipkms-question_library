import _ from 'lodash'
export const calAnswerDiff = function (questionType, newAnswers, oldAnswers) {
  if (questionType === 'mc') {
    if (_.isArray(newAnswers) && _.isArray(oldAnswers)) {
      var oldAnswersObject = _.map(oldAnswers, function (value, key) {
        var obj = {}
        if (value === null) {
          obj[key] = ''
        } else {
          obj[key] = value
        }
        return obj
      })

      var newAnswersObject = _.map(newAnswers, function (value, key) {
        var obj = {}
        if (value === null) {
          obj[key] = ''
        } else {
          obj[key] = value
        }
        return obj
      })

      // console.log(oldAnswersObject)
      // console.log(newAnswersObject)

      return _.differenceWith(newAnswersObject, oldAnswersObject, _.isEqual)
    } else {
      return []
    }
  }
}

export const posToChoiceLable = function (pos) {
  if (_.isNumber(pos) && pos >= 0 && pos <= 3) {
    switch (pos) {
      case 0:
        return 'A'
      case 1:
        return 'B'
      case 2:
        return 'C'
      case 3:
        return 'D'
      default:
        return ''
    }
  }
}
