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
    it('Able to new Engine() with version 0', function(done) {
      story = new Engine('myStory', './save')
      story.on('version', v => {
        done(assert.equal(v, 0))
      })
    })
    it('Which should be object', function() {
      assert.equal(typeof story, 'object')
    })
    it('The version will be 1 if changed', function(done) {
      story.version(1).then(() => {
        story.version().then(v => {
          done(assert.equal(v, 1))
        })
      })
    })
  })
  describe('Story', function() {
    it('We could insert story to some chapter', function insert(done) {
      story.putChapter('one', [{
        Simon: 'What is your name?'
      }, {
        Andrew: 'My name is Andrew.'
      }, {
        Simon: 'Nice to meet you.'
      }, {
        Andrew: 'Nice to meet you too.'
      }]).then(done)
    })
    it('And we could get the correct chapter menu', function(done) {
      story.getChapter('one').then(menu => {
        done(assert.equal(menu, 4))
      })
    })
    it('And we could get the corrct chapter based on index', function(done) {
      story.getChapter('one', 2).then(v => {
        done(assert.equal(v.Andrew, 'My name is Andrew.'))
      })
    })
  })
  describe('Player', function() {
    it('there should be no player when story is just created', function(done) {
      story.getPlayers().then(v => {
        done(assert.equal(v.length, 0))
      })
    })
  })
})
