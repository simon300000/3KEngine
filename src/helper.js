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
