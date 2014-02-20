*This repository is a mirror of the [component](http://component.io) module [wryk/hash](http://github.com/wryk/hash). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/wryk-hash`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
# Hash

Map object without es6 object as key feature (perf improvement)


## Installation
Hash use [component(1)](https://github.com/component/component)
```batch
$ component-install wryk/hash
```

Without [component(1)](https://github.com/component/component), just include `hash.js` or `hash.min.js` inside your scripts.
 

## Usage
```javascript
var configuration = new Hash({
	string: 'myString',
	number: 1337
});

configuration.get('number'); //=> 1137

configuration.set('fn', function () {
	return 'myFunction executed';
});

configuration.has('foo'); //=> false
configuration.size; //=> 3

configuration.delete('number'); //=> true

var context = {};
configuration.forEach(function (value, key, hash) {
	// iterate over hash ...
}, context);


var iterator = configuration.entries();
var entry;
while ((entry = iterator.next()) !== null) {
	// iterate over hash ...
}
```

## API
#### new Hash(object)
#### #get(key)
#### #set(key, value)
#### #delete(key)
#### #has(key)
#### #clear()
#### #size
#### #forEach(callback, context)
#### #iterator(kind)
#### #keys()
#### #values()
#### #entries()

## Running tests
```batch
$ npm install
$ npm test
```

## License
MIT