const EventEmitter = require('events').EventEmitter

const level = require('./database')

class engine {
  constructor(name, savefile) {
    this.name = name
    this.event = new EventEmitter()
    level(savefile, async (db) => {
      this.db = db
      this.emit('version', await this.db.get('version'))
    })
  }
  emit(channel, value) {
    this.event.emit(channel, value)
  }
  on(channel, callback) {
    this.event.on(channel, callback)
  }
  version(v) {
    return new Promise(async (resolve, reject) => {
      if (v === undefined) {
        resolve(await this.db.get('version'))
      } else {
        resolve(await this.db.put('version', v))
      }
    })
  }
  putChapter(chapter, array) {
    return this.db.batch(
      [{
        type: 'put',
        key: `chapter_${chapter}_0`,
        value: JSON.stringify(array.length)
      }].concat(array.map((u, index) => {
        return {
          type: 'put',
          key: `chapter_${chapter}_${index + 1}`,
          value: JSON.stringify(u)
        }
      })))
  }
  getChapter(chapter, index) {
    index = index || 0
    return new Promise(async (resolve, reject) => {
      resolve(await this.db.get(`chapter_${chapter}_${index}`))
    })
  }
}

module.exports = engine
