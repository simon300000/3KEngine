const chai = require('chai')
const assert = chai.assert
const Engine = require('../')

describe('Basic', () => {
  it('module should output a function', () => {
    assert.equal(typeof Engine, 'function')
  })
  let story
  it('Able to new Engine()', () => {
    story = new Engine('myStory', './save')
  })
  it('Which should be object', () => {
    assert.equal(typeof story, 'object')
  })
})
