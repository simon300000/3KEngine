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
  getPlayer(index) {
    return new Promise(async (resolve, reject) => {
      resolve(await this.db.get(`player_${index}`))
    })
  }
  setPlayer(index, value) {
    return new Promise(async (resolve, reject) => {
      let playerList = await this.db.get('player')
      playerList[index] = true
      await this.db.put('player', playerList)
      resolve(await this.db.put(`player_${index}`, value))
    })
  }
  delPlayer(index) {
    return new Promise(async (resolve, reject) => {
      let playerList = await this.db.get('player')
      playerList[index] = false
      resolve(await this.db.put('player', playerList))
    })
  }
  newPlayer() {
    return new Promise(async (resolve, reject) => {
      let playerList = await this.db.get('player')
      for (let i = 0; i < playerList.length; i++) {
        if (!playerList[i]) {
          resolve(i)
        }
      }
      resolve(playerList.length)
    })
  }
}

module.exports = engine
