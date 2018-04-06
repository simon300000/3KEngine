const chai = require('chai')
const assert = chai.assert
const Engine = require('../')
const fs = require('fs-extra')


after(() => {
  fs.emptyDir('./save').then(() => {
    fs.rmdir('./save')
  })
})

describe('Test', function() {
  let story
  describe('Basic', function() {
    it('Module should output a function', function() {
      assert.equal(typeof Engine, 'function')
    })
    it('Able to new Engine() with version 0', async function() {
      story = new Engine('myStory', './save')
      let v = await (new Promise((resolve, reject) => {
        story.on('ready', v => {
          resolve(v)
        })
      }))
      assert.equal(v, 0)
    })
    it('Which should be object', function() {
      assert.equal(typeof story, 'object')
    })
    it('The version will be 1 if changed', async function() {
      await story.version(1)
      let v = await story.version()
      assert.equal(v, 1)
    })
  })
  describe('Story', function() {
    it('We could insert story to some chapter', async function() {
      await story.putChapter('one', [{
        Simon: 'What is your name?'
      }, {
        Andrew: 'My name is Andrew.'
      }, {
        Simon: 'Nice to meet you.'
      }, {
        Andrew: 'Nice to meet you too.'
      }])
    })
    it('And we could get the correct chapter menu', async function() {
      let menu = await story.getChapters('one')
      assert.equal(menu, 4)
    })
    it('And we could get the corrct chapter based on index', async function() {
      let v = await story.getChapter('one', 1)
      assert.equal(v.Andrew, 'My name is Andrew.')
    })
  })
  describe('Player', function() {
    it('There should be no player when story is just created', async function() {
      let v = await story.getPlayers()
      assert.equal(v.length, 0)
    })
    let id
    it('The first player will have id of 0', async function() {
      id = await story.newPlayer()
      assert.equal(id, 0)
    })
    it('We could insert some data to this player 0', async function() {
      await story.setPlayer(id, {
        name: 'Simon'
      })
    })
    it('There should be one player now', async function() {
      let v = await story.getPlayers()
      assert.equal(v.length, 1)
    })
    it('And we could get the data save in player 0', async function() {
      let player = await story.getPlayer(id)
      assert.equal(player.name, 'Simon')
    })
    it('The second player will have id of 1', async function() {
      let secondId = await story.newPlayer()
      assert.equal(secondId, 1)
    })
    it('And we could delete player 0', async function() {
      await story.delPlayer(id)
    })
    it('The player id will go back to 0 since we deleted that player', async function() {
      let secondId = await story.newPlayer()
      assert.equal(secondId, 0)
    })
    it('The player list of player id 0 should be false now', async function() {
      let v = await story.getPlayers()
      assert.equal(v[0], false)
    })
  })
})
