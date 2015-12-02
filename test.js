var assert = require('assert')
var debounce = require('./')

// A getter only gets executed once
// It collects all callbacks and invokes them
// after the first callback got executed
var executions = 0
var get = debounce(otherGetter)
function otherGetter (id, callback) {
  executions += 1
  setTimeout(function () { callback('arg1', 'arg2') }, 1)
}

var multi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
var second = debounce(function (arg1, arg2, arg3, callback) {
  assert.equal(arg1, 'a')
  assert.equal(arg2, 'b')
  assert.equal(arg3, 'c')
  callback()
})

function callback () {}
second('a', 'b', 'c', callback)

// The last argument has to be a callback
var third = debounce(function (a, cb) {})
assert.throws(function () { third('a', 'b') }, /The last argument has to be a callback/)
assert.doesNotThrow(function () { third('a', callback) })

//
// Check cache
var i = 0
var cached = debounce(function (a, cb) {
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

process.on('exit', function (exitCode) {
  if (!exitCode) console.log('All tests succeeded.')
})
