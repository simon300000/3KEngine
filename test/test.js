const chai = require('chai')
const assert = chai.assert
const Engine = require('../')

describe('Basic', function() {
  describe('typeof', function() {
    it('module should output a function', function() {
      assert.equal(typeof Engine, 'function')
    })
  })
})
