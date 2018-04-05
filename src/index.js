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
    return (async () => {
      if (v === undefined) {
        return this.db.get('version')
      } else {
        return this.db.put('version', v)
      }
    })()
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
    return (async () => {
      return this.db.get(`chapter_${chapter}_${index}`)
    })()
  }
  getPlayer(index) {
    return (async () => {
      return this.db.get(`player_${index}`)
    })()
  }
  getPlayers() {
    return (async () => {
      return this.db.get(`player`)
    })()
  }
  setPlayer(index, value) {
    return (async () => {
      let playerList = await this.db.get('player')
      playerList[index] = true
      await this.db.put('player', playerList)
      return this.db.put(`player_${index}`, value)
    })()
  }
  delPlayer(index) {
    return (async () => {
      let playerList = await this.db.get('player')
      playerList[index] = false
      return this.db.put('player', playerList)
    })()
  }
  newPlayer() {
    return (async () => {
      let playerList = await this.db.get('player')
      for (let i = 0; i < playerList.length; i++) {
        if (!playerList[i]) {
          return i
        }
      }
      return playerList.length
    })()
  }
}

module.exports = engine
