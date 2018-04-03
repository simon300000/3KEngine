const level = require('level')

class engine {
  constructor(name, savefile) {
    this.name = name
    this.db = level(savefile)
  }
}

module.exports = engine
