import _ from 'lodash'
export const zipSampleToStudent = function (samples, students) {
  if (samples.length > 0) {
    _.forEach(samples, function (sample) {
      let index = getIndexOfStudents(students, sample.student)
      if (index > -1) {
        let student = students[index]
        if (_.has(sample, 'finishTime')) {
          student['status'] = 'finish'
        }
        student['sample'] = sample
        students[index] = student
      }
    })
    return students
  }
}

export const studentIndex = function (students, student_id) {
  return getIndexOfStudents(students, student_id)
}

function getIndexOfStudents (students, student_id) {
  return _.findIndex(students, function (student) { return student._id === student_id })
}
