# cached-callback

## Example
```js
var cached = require('cached-callback')
var getter = cached(function (id, callback) {
  request('http://example.com/'+id, callback)
})

getter('test.html', function (err, data) {
  console.log(err, data)
})
```


## API

var cached = require('cached-callback') // returns a function


### cached(function (id, args.., callback) { callback() })
Accepts a getter function as parameter.
The function should accept at least two arguments.
The first one should be an identifier, this should be a number or a string
The last argument should be a callback that you'll execute once your async operation is complete.

### cached(function)(id, args.., callback)
You can pass any arguments to invoke the function returned from `cached(func)`.
To benefit from the caching, you should pass a `string` or a `number` as first parameter.
The last parameter must be a callback. The callback should have the same position as when registering the getter.
