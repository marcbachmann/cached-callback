module.exports = function debounce (getter, cacher) {
  var map = {}
  var cache = (typeof cacher === 'object') ? cacher : cacher ? new Cache() : false

  return function collectCallbacks (id, __argsAndCallback) {
    var args = toArray(arguments)
    var callback = args.pop()
    if (typeof callback !== 'function') throw new Error('The last argument has to be a callback.')

    var cached
    if (cache && (cached = cache.get(id))) {
      invoke(callback, cached, cached.length)
      return
    }

    var callbacks = map[id]
    if (callbacks && callbacks.length) {
      callbacks.push(callback)
      return
    }
    callbacks = map[id] = [callback]

    args.push(function getterCallback () {
      if (cache) cache.set(id, arguments)
      delete map[id]
      var argumentLength = arguments.length
      for (var i = 0; i < callbacks.length; i++) {
        invoke(callbacks[i], arguments, argumentLength)
      }
    })

    invoke(getter, args, args.length)
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

function Cache () {
  this.values = {}
}

Cache.prototype.get = function (key) {
  return this.values[key]
}

Cache.prototype.set = function (key, args) {
  this.values[key] = args
}
