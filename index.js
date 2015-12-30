/* global define */
(function (root) {
  function cachedCallback (getter, cacher) {
    var map = {}
    var cache = (typeof cacher === 'object') ? cacher : cacher ? memoryCache() : false

    return function collect (id, __argsAndCallback) {
      var args = toArray(arguments)
      var callback = args.pop()
      if (typeof callback !== 'function') throw new Error('The last argument has to be a callback.')

      var cached
      if (cache && (cached = cache.get(id))) return invoke(callback, cached, cached.length)

      var callbacks = map[id]
      if (callbacks && callbacks.length) return callbacks.push(callback)
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
    for (var i = 0, len = arrayLike.length; i < len; i++) {
      args.push(arrayLike[i])
    }
    return args
  }

  function invoke (cb, a, length) {
    switch (length) {
      case 0: cb(); break
      case 1: cb(a[0]); break
      case 2: cb(a[0], a[1]); break
      case 3: cb(a[0], a[1], a[2]); break
      case 4: cb(a[0], a[1], a[2], a[3]); break
      default: cb.apply(null, a)
    }
  }

  function memoryCache () {
    var values = {}
    return {
      get: function (key) {
        return values[key]
      },
      set: function (key, args) {
        values[key] = args
      }
    }
  }

  if (typeof exports === 'object') {
    module.exports = cachedCallback
  } else if (typeof define === 'function' && define.amd) {
    define(cachedCallback)
  } else {
    root.cachedCallback = cachedCallback
  }
})(this)
