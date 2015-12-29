# cached-callback

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
