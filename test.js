const assert = require('assert')
const debounce = require('./')

// A getter only gets executed once
// It collects all callbacks and invokes them
// after the first callback got executed
let executions = 0
const get = debounce(otherGetter)
function otherGetter (id, callback) {
  executions += 1
  setTimeout(function () { callback('arg1', 'arg2') }, 1)
}

const multi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
multi.forEach(function () {
  get(1, function (arg1, arg2) {
    assert.equal(executions, 1)
    assert.equal(arg1, 'arg1')
    assert.equal(arg2, 'arg2')
  })
})

// getter gets invoked a second time after
// the first function returned the callback
setTimeout(function () {
  multi.forEach(function () {
    get('foobar', function (arg1, arg2) {
      assert.equal(executions, 2)
      assert.equal(arg1, 'arg1')
      assert.equal(arg2, 'arg2')
    })
  })
}, 10)

// All arguments get passed to the getter
const second = debounce(function (arg1, arg2, arg3, callback) {
  assert.equal(arg1, 'a')
  assert.equal(arg2, 'b')
  assert.equal(arg3, 'c')
  callback()
})

function callback () {}
second('a', 'b', 'c', callback)

// The last argument has to be a callback
const third = debounce(function (a, cb) {})
assert.throws(function () { third('a', 'b') }, /The last argument has to be a callback/)
assert.doesNotThrow(function () { third('a', callback) })

// test debounce when no key is used
let called = 0
const without = debounce(function (cb) {
  setTimeout(function () { cb(++called) }, 1)
})

without(function (val) { assert.equal(val, 1) })
without(function (val) { assert.equal(val, 1) })
setTimeout(function () {
  without(function (args) { assert.equal(args, 2) })
}, 2)

//
// Check cache
let i = 0
const cached = debounce(function (a, cb) {
  cb(null, i++)
}, true)

cached(1, function (err, val) {
  if (err) throw err
  assert.equal(val, 0)
})

// second time should still return cached result
setTimeout(function () {
  cached(1, function (err, val) {
    if (err) throw err
    assert.equal(val, 0)
  })
}, 10)

// test cache setter cachedCallback.cache(true)
// test caching when no key is passed
const cachedCallback = require('./').cache(true)
let times = 0
const persistent = cachedCallback(function (cb) {
  setTimeout(function () { cb(++times) }, 1)
})

persistent(function (val) { assert.equal(val, 1) })
persistent(function (val) { assert.equal(val, 1) })
setTimeout(function () {
  persistent(function (val) { assert.equal(val, 1) })
}, 2)

process.on('exit', function (exitCode) {
  if (!exitCode) console.log('All tests succeeded.') // eslint-disable-line no-console
})
