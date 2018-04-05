const EventEmitter = require('events').EventEmitter

const level = require('./database')

class engine {
  constructor(name, savefile) {
    this.name = name
    this.event = new EventEmitter()
    level(savefile, async (db) => {
      this.db = db
      this.db.get('version').then(data => {
        this.emit('version', data)
      })
    })
  }
  emit(channel, value) {
    this.event.emit(channel, value)
  }
  on(channel, callback) {
    this.event.on(channel, callback)
  }
  version(v) {
    return new Promise((resolve, reject) => {
      if (v === undefined) {
        this.db.get('version').then(value => {
          resolve(value)
        })
      } else {
        this.db.put('version', v).then(v => {
          resolve(v)
        })
      }
    })
  }
  put(chapter, array) {
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
  get(chapter, index) {
    index = index || 0
    return new Promise((resolve, reject) => {
      this.db.get(`chapter_${chapter}_${index}`).then(resolve, reject)
    })
  }
}

module.exports = engine
