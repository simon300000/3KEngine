const R = require('ramda')

/**
 * Encode a chapter to a batch which
 * could be insert to database.
 * @method encodeChapter
 * @param  {String}      chapter Chapter name
 * @param  {Array}      array   Chapter array
 * @return {Array}              The batch array
 */
exports.encodeChapter = (chapter, array) => {
  let marks = []
  let batchArray = [{
    type: 'put',
    key: `chapter_${chapter}`,
    value: array.length
  }].concat(array.map((u, index) => {
    if (u.mark) {
      marks.push({
        type: 'put',
        key: `mark_${u.mark}`,
        value: `chapter_${chapter}_index_${index}`
      })
    }
    return {
      type: 'put',
      key: `chapter_${chapter}_index_${index}`,
      value: u
    }
  })).concat(marks)
  return batchArray
}

/**
 * Catch the error
 * @method promise
 * @param  {Function} fn  The Promise function
 * @param  {Function}   rfn Function before resolve
 * @return {Promise}       Return the Promise that should have no eror
 */
exports.promise = (fn, rfn) => {
  rfn = rfn || (v => v)
  return new Promise(resolve => {
    fn
      .then(R.compose(resolve, rfn))
      .catch(console.error)
  })
}
