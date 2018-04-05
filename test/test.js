const chai = require('chai')
const assert = chai.assert
const Engine = require('../')
const fs = require('fs-extra')


describe('Test', function() {
  let story
  after(() => {
    fs.emptyDir('./save').then(() => {
      fs.rmdir('./save')
    })
  })
  describe('Basic', function() {
    it('module should output a function', function() {
      assert.equal(typeof Engine, 'function')
    })
    it('Able to new Engine() with version 0', async function() {
      story = new Engine('myStory', './save')
      let v = await (new Promise((resolve, reject) => {
        story.on('version', v => {
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
      let menu = await story.getChapter('one')
      assert.equal(menu, 4)
    })
    it('And we could get the corrct chapter based on index', async function() {
      let v = await story.getChapter('one', 2)
      assert.equal(v.Andrew, 'My name is Andrew.')
    })
  })
  describe('Player', function() {
    it('there should be no player when story is just created', async function() {
      let v = await story.getPlayers()
      assert.equal(v.length, 0)
    })
  })
})
