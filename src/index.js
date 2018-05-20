const level = require('./database')
const R = require('ramda')
const helper = require('./helper')

/**
 * The 3KEngine
 */

// TODO: The next() script and all related

class engine {
  /**
   * Create a new engine instance
   * @method constructor
   * @param  {String}    name     The name of the engine
   */
  constructor(name) {
    this.name = name
    this.ready = false
    this.currentPlayer = undefined
  }
  /**
   * Link the database
   * @method init
   * @param  {String}  savefile The location of database
   * @return {Promise}          Resolve the database version after initialize
   */
  async init(savefile) {
    this.db = await level(this.name, savefile)
    this.ready = true
    return this.db.get('version')
  }
  /**
   * Close Database
   * @method close
   * @return {Promise} Resolve when database is closed
   */
  close() {
    return this.db.db.close()
  }
  /**
   * Return current database version if v is undefined,
   * Modify current database version to v if v is defined
   * @method version
   * @param  {Number}  v The target database version
   * @return {Promise}   Resolve current version
   */
  version(v) {
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
   * @param  {Array}    array   The array of story in this chapter
   * @return {Promise}          Resolve when finnshed
   */
  putChapter(chapter, array) {
    return R.compose(this.db.batch, helper.encodeChapter)(chapter, array)
  }
  /**
   * Get chapter content in database
   * @method chapter
   * @param  {String}   chapter Chapter name
   * @param  {Number}   index   What content in the chapter to get
   * @return {Promise}          Resolve the target content
   */
  chapter(chapter, index) {
    return this.db.get(`chapter_${chapter}_index_${index}`)
  }
  /**
   * Get target chapter's length
   * @method chapters
   * @param  {String}    chapter Chapter name
   * @return {Promise}           Resolve the length of chapter
   */
  chapters(chapter) {
    return this.db.get(`chapter_${chapter}`)
  }
  /**
   * Get the location of some mark
   * @method mark
   * @param  {String} name  Mark name
   * @return {Promise}      Resolve the Mark location as a Array: [chapter, index]
   */
  mark(name) {
    return this.db.get(`mark_${name}`)
  }
  /**
   * Get some player data
   * @method player
   * @param  {Number}  index The id of target player
   * @return {Promise}       Resolve the target player's data
   */
  player(index) {
    return this.db.get(`player_${index}`)
  }
  /**
   * Get players array which if the player exsit,
   * the corresponding array[index] will be true
   * @method players
   * @return {Promise}  Resolve the players array
   */
  players() {
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
   * Return a index that is not taken by any player
   * @method newPlayer
   * @return {Promise} Resolve a index that is not taken by any player
   */
  async newPlayer() {
    let playerList = await this.db.get('player')
    for (let i = 0; i < playerList.length; i++) {
      if (!playerList[i]) return i
    }
    return playerList.length
  }
  /**
   * Return config settings
   * @method config
   * @return {Promise} Resolve configuration
   */
  config() {
    return this.db.get('config')
  }
  /**
   * Change config settings
   * @method setConfig
   * @param  {Object}  config The target config to change
   * @return {Promise}        Resolve when finnshed
   */
  setConfig(config) {
    return this.db.put('config', config)
  }
}

module.exports = engine
