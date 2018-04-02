const chai = require('chai')
const assert = chai.assert
const engine = require('../')

describe('Basic', function() {
  describe('typeof', function() {
    it('module should output a function', function() {
      assert.equal(typeof engine, 'function')
    })
  })
})
