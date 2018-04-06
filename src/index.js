const EventEmitter = require('events').EventEmitter

const level = require('./database')

class engine {
  /**
   * Create a new engine instance
   * @method constructor
   * @param  {String}    name     The name of the engine
   * @param  {String}    savefile The location of database
   */
  constructor(name, savefile) {
    this.name = name
    this.event = new EventEmitter()
    level(name, savefile, async (db) => {
      this.db = db
      this.emit('version', await this.db.get('version'))
    })
  }
  /**
   * Emit a new event
   * @method emit
   * @param  {String} channel The event name
   * @param  {String} value   Event data
   * @return {undefined}      no return
   */
  emit(channel, value) {
    this.event.emit(channel, value)
  }
  /**
   * Create a event listener
   * @method on
   * @param  {String}   channel  The event name
   * @param  {Function} callback Event Callback
   * @return {undefined}         no return
   */
  on(channel, callback) {
    this.event.on(channel, callback)
  }
  /**
   * Return current database version if v is undefined,
   * Modify current database version to v is v is defined
   * @method version
   * @param  {Number}  v The target database version
   * @return {Promise}   Resolve current version
   */
  async version(v) {
    if (v === undefined) {
      return this.db.get('version')
    } else {
      return this.db.put('version', v)
    }
  }
  /**
   * Put chapter in database
   * @method putChapter
   * @param  {String}   chapter Chapter name
   * @param  {Array}    array   The array of storys in this chapter
   * @return {Promise}          Resolve when finnshed
   */
  putChapter(chapter, array) {
    return this.db.batch(
      [{
        type: 'put',
        key: `${this.name}_chapter_${chapter}`,
        value: JSON.stringify(array.length)
      }].concat(array.map((u, index) => {
        return {
          type: 'put',
          key: `${this.name}_chapter_${chapter}_${index}`,
          value: JSON.stringify(u)
        }
      })))
  }
  /**
   * Get chapter content in database
   * @method getChapter
   * @param  {String}   chapter Chapter name
   * @param  {Number}   index   What content in the chapter to get
   * @return {Promise}          Resolve the target content
   */
  async getChapter(chapter, index) {
    return this.db.get(`chapter_${chapter}_${index}`)
  }
  /**
   * Get target chapter's length
   * @method getChapters
   * @param  {String}    chapter Chapter name
   * @return {Promise}           Resolve the length of chapter
   */
  async getChapters(chapter) {
    return this.db.get(`chapter_${chapter}`)
  }
  /**
   * Get some player data
   * @method getPlayer
   * @param  {Number}  index The id of target player
   * @return {Promise}       Resolve the target player's data
   */
  async getPlayer(index) {
    return this.db.get(`player_${index}`)
  }
  /**
   * Get players array which if the player exsit,
   * the corresponding array[index] will be true
   * @method getPlayers
   * @return {Promise}  Resolve the players array
   */
  async getPlayers() {
    return this.db.get(`player`)
  }
  /**
   * Put data in database player with target id
   * @method setPlayer
   * @param  {Number}  index Target player's index
   * @param  {Object}  value Target player data
   * @return {Promise}       Resolve when finnshed
   */
  async setPlayer(index, value) {
    let playerList = await this.db.get('player')
    playerList[index] = true
    await this.db.put('player', playerList)
    return this.db.put(`player_${index}`, value)
  }
  /**
   * Remove player with target id
   * It does not remove the data of the player, it set false to players array
   * @method delPlayer
   * @param  {Number}  index Target player's id
   * @return {Promise}       Resolve when finnshed
   */
  async delPlayer(index) {
    let playerList = await this.db.get('player')
    playerList[index] = false
    return this.db.put('player', playerList)
  }
  /**
   * Return a blank index for new player
   * @method newPlayer
   * @return {Promise} Resolve a index that is not taken by any player
   */
  async newPlayer() {
    let playerList = await this.db.get('player')
    for (let i = 0; i < playerList.length; i++) {
      if (!playerList[i]) {
        return i
      }
    }
    return playerList.length
  }
}

module.exports = engine
