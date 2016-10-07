exports = module.exports = function (delta) {
  delta = JSON.parse(delta)
  var result = delta.map(function (op) {
    var html = op.insert
    if (typeof op.insert !== 'string') {
      if (op.insert.formula) {
        html = window.katex.renderToString(op.insert.formula)
      } else {
        return ''
      }
    }
    if (op.attributes && op.attributes.bold) {
      html = '<strong>' + html + '</strong>'
    }

    if (op.insert.formula) {
      html = window.katex.renderToString(op.insert.formula)
    }

    return html
  }).join('')

  return result
}
