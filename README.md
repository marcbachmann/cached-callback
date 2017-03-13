# cached-callback

[![Greenkeeper badge](https://badges.greenkeeper.io/marcbachmann/cached-callback.svg)](https://greenkeeper.io/)

cached-callback caches arguments returned from an earlier execution and passes them to a callback passed in


## Examples
```js
var cachedCallback = require('cached-callback')
```

### Debounce
Debounces an invocation with a specific key as long as it's callback is not yet called
```js
var debounced = cachedCallback(function (id, callback) {
  request('http://example.com/'+id, callback)
})

// The request only gets triggered once even when you
// invoke the wrapped method multiple times.
debounced('test.html', function (err, data) { console.log(err, data) })
debounced('test.html', function (err, data) { console.log(err, data) })

// So this shouldn't result in the same output
setTimeout(function () {
  debounced('test.html', function (err, data) { console.log(err, data) })
}, 10000)
```

### Persistent cache
Permanently caches the result of the callback.
Multiple invocations result in the same output.
(Only use this in a controlled environment. This fills an object with the whole response of the callback. So it might lead to a memory leak.)
```js
var cached = cachedCallback(function (id, callback) {
  request('http://example.com/'+id, callback)
}, true)

cached('test.html', function (err, data) { console.log(err, data) })

// This is definitely the same response
setTimeout(function () {
  cached('test.html', function (err, data) { console.log(err, data) })
}, 10000)
```

The second `cache` argument is also exposed with `.cache()`
```js
var cached = require('cached-callback').cache()
var get = cached(function (id, callback) {
  request('http://example.com/'+id, callback)
}
```

### Custom caching method
Caches the result with a custom caching method.
This example caches the result for 20 seconds.
```js
var cache = {}
var setterAndGetter = {
  get: function get (key) {
    return cache[key]
  },
  set: function set (key, value) {
    cache[key] = value
    setTimeout(function () { delete cache[key] }, 20000)
  }
}

var custom = cachedCallback(function (id, callback) {
  request('http://example.com/'+id, callback)
}, setterAndGetter)
```


## Why don't I use `async.memoize`?

I ended up writing similar code like this module tons of times and didn't find `async.memoize` when I needed it.
IMO asyncjs also got too large and could benefit from some modularization.

The advantage of this module is that you can hook up a custom cache method.
E.g. a lru cache like https://www.npmjs.com/package/lru-cache

