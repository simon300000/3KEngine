const chai = require('chai')
const assert = chai.assert
const Engine = require('../')
const fs = require('fs-extra')


describe('Test', function() {
  after(() => {
    fs.emptyDir('./save').then(() => {
      fs.rmdir('./save')
    })
  })
  describe('Basic', function() {
    it('module should output a function', function() {
      assert.equal(typeof Engine, 'function')
    })
    let story
    it('Able to new Engine() with version 0', function(done) {
      story = new Engine('myStory', './save')
      story.on('version', (v) => {
        done(assert.equal(v, 0))
      })
    })
    it('Which should be object', function() {
      assert.equal(typeof story, 'object')
    })
    it('The version will be 1 if changed', function(done) {
      story.version(1).then(()=>{
        story.version().then((v)=>{
          done(assert.equal(v, 1))
        })
      })
    })
  })
})
