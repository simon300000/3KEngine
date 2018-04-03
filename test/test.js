const chai = require('chai')
const assert = chai.assert
const Engine = require('../')

describe('Basic', function() {
  it('module should output a function', function() {
    assert.equal(typeof Engine, 'function')
  })
  it('Able to new Engine()', function() {
    let story = new Engine('myStory', './save')
  })
})
