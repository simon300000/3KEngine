const chai = require('chai')
const assert = chai.assert
const Engine = require('../')
const fs = require('fs-extra')


describe('Test', () => {
  after(() => {
    fs.emptyDir('./save').then(()=>{
      fs.rmdir('./save')
    })
  })
  describe('Basic', () => {
    it('module should output a function', () => {
      assert.equal(typeof Engine, 'function')
    })
    let story
    it('Able to new Engine() with version 0', (done) => {
      story = new Engine('myStory', './save')
      story.on('version', (v) => {
        done(assert.equal(v, 0))
      })
    })
    it('Which should be object', () => {
      assert.equal(typeof story, 'object')
    })
  })
})
