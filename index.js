/* global define */
(function (root) {
  function cachedCallback (getter, cacher) {
    const map = {}
    const cache = (typeof cacher === 'object' && cacher) || (cacher && memoryCache()) || false

    return function collect (id, __argsAndCallback) {
      const args = toArray(arguments)
      const callback = args.pop()
      if (typeof callback !== 'function') throw new Error('The last argument has to be a callback.')

      let cached
      if (cache && (cached = cache.get(id))) return invoke(callback, cached, cached.length)

      let callbacks = map[id]
      if (callbacks && callbacks.length) return callbacks.push(callback)
      callbacks = map[id] = [callback]

      args.push(function getterCallback () {
        if (cache) cache.set(id, arguments)
        delete map[id]
        const argumentLength = arguments.length
        for (let i = 0; i < callbacks.length; i++) {
          invoke(callbacks[i], arguments, argumentLength)
        }
      })

      invoke(getter, args, args.length)
    }
  }

  function toArray (arrayLike) {
    const args = []
    for (let i = 0, len = arrayLike.length; i < len; i++) {
      args.push(arrayLike[i])
    }
    return args
  }

  function invoke (cb, a, length) {
    switch (length) {
      case 0: return cb()
      case 1: return cb(a[0])
      case 2: return cb(a[0], a[1])
      case 3: return cb(a[0], a[1], a[2])
      case 4: return cb(a[0], a[1], a[2], a[3])
      default: return cb.apply(null, a)
    }
  }

  function memoryCache () {
    const values = {}
    return {
      get: function (key) {
        return values[key]
      },
      set: function (key, args) {
        values[key] = args
      }
    }
  }

  cachedCallback.cache = function configureCache (cacher) {
    if (typeof cacher === 'undefined') cacher = true
    return function cachedCallbackWithCache (getter) {
      return cachedCallback(getter, cacher)
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
