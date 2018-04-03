const chai = require('chai')
const assert = chai.assert
const Engine = require('../')

describe('Basic', () => {
  it('module should output a function', () => {
    assert.equal(typeof Engine, 'function')
  })
  it('Able to new Engine()', () => {
    let story = new Engine('myStory', './save')
  })
})
