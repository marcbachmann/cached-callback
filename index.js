module.exports = function debounce (getter, useCache) {
  var map = {}

  return function collectCallbacks (id, __argsAndCallback) {
    var args = toArray(arguments)
    var callback = args.pop()
    if (typeof callback !== 'function') throw new Error('The last argument has to be a callback.')

    var callbacks = map[id]
    if (callbacks && callbacks.length) return callbacks.push(callback)
    callbacks = map[id] = [callback]

    args.push(function getterCallback () {
      delete map[id]
      var argumentLength = arguments.length
      for (var i = 0; i < callbacks.length; i++) {
        invoke(callbacks[i], arguments, argumentLength)
      }
    })

    getter.apply(null, args)
  }
}

function toArray (arrayLike) {
  var args = []
  for (var i = 0; i < arrayLike.length; i++) {
    args.push(arrayLike[i])
  }
  return args
}

function invoke (cb, a, length) {
  switch (length) {
    case 0: cb(); break
    case 1: cb(a[0], a[1]); break
    case 2: cb(a[0], a[1], a[2]); break
    case 3: cb(a[0], a[1], a[2], a[3]); break
    default: cb.apply(null, a)
  }
}
