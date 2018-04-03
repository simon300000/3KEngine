const chai = require('chai')
const assert = chai.assert
const Engine = require('../')

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
