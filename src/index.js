const level = require('level')
const EventEmitter = require('events').EventEmitter

class engine {
  constructor(name, savefile) {
    this.name = name
    this.event = new EventEmitter()
    level(savefile, (err, db) => {
      if (err) throw err
      this.db = db
      this.db.get('version').then(data => {
        this.emit('version', data)
      }, (e) => {
        if (e.notFound) {
          this.db.put('version', 0).then(() => {
            this.emit('init', 0)
          }, (e) => {
            throw e
          })
        } else {
          throw e
        }
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
        }, e => {
          reject(e)
        })
      } else {
        this.db.put('version', v).then(v => {
          resolve(v)
        }, e => {
          reject(e)
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
      this.db.get(`chapter_${chapter}_${index}`).then(v => {
        resolve(JSON.parse(v))
      }, reject)
    })
  }
}

module.exports = engine
