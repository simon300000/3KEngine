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
    return this.db.batch(array.map((u, index) => {
      return {
        type: 'put',
        key: `chapter_${chapter}_${index}`,
        value: u
      }
    }).concat({
      type: 'put',
      key: `chapter_${chapter}`,
      value: array.length
    }))
  }
  get(chapter, index) {
    if (index === undefined) {
      return this.db.get(`chapter_${chapter}`)
    } else {
      return this.db.get(`chapter_${chapter}_${index}`)
    }
  }
}

module.exports = engine
