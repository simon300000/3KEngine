const level = require('level')
const EventEmitter = require('events').EventEmitter

class engine {
  constructor(name, savefile) {
    this.name = name
    this.event = new EventEmitter()
    level(savefile, (err, db) => {
      if (err) throw err
      this.db = db
      this.on('')
    })
  }
  emit(channel, value) {
    this.event.emit(channel, value)
  }
  on(channel, callback) {
    this.event.on(channel, callback)
  }
}

module.exports = engine
