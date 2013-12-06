;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("hash/index.js", function(exports, require, module){
module.exports = Hash;

/**
 * @class Hash
 * @constructor
 * @param {Object} object
 * @param {Hash}
**/
function Hash (object) {
	this._entries = {};
	var key;

	for (key in object) {
		if (object.hasOwnProperty(key)) {
			this.set(key, object[key]);
		}
	}
}

/**
 * get entry value associated with `key`
 * @method get
 * @param {String} key
 * @return {any}
**/
Hash.prototype.get = function (key) {
	return this._entries[key];
};

/**
 * set entry value associated with `key`
 * @method set
 * @param {String} key
 * @param {any} value
**/
Hash.prototype.set = function (key, value) {
	this._entries[key] = value;
};

/**
 * remove entry key and value with `key`
 * @method delete
 * @param {String} key
 * @return {Boolean}
**/
Hash.prototype.delete = function (key) {
	return this.has(key) && delete this._entries[key];
};

/**
 * boolean for entry existence
 * @method has
 * @param {String} key
 * @return {Boolean}
**/
Hash.prototype.has = function (key) {
	return this._entries.hasOwnProperty(key);
};

/**
 * remove all entries
 * @method clear
**/
Hash.prototype.clear = function () {
	var entries = this._entries;
	var key;

	for (key in entries) {
		if (entries.hasOwnProperty(key)) {
			delete entries[key];
		}
	}
};

/**
 * numbers of entries
 * @readonly
 * @property size
 * @type {Number}
 * @default 0
**/
Object.defineProperty(Hash.prototype, 'size', {
	configurable: true,
	get: function () {
		var counter = 0;
		var entries = this._entries;
		var key;

		for (key in entries) {
			if (entries.hasOwnProperty(key)) { counter++; }
		}

		return counter;
	}
});

/**
 * call `callback` with `context` as this for all entries with (value, key, hash)
 * @method forEach
 * @param {Function} callback
 * @param {Object} context
 * @return {Hash}
**/
Hash.prototype.forEach = function (callback, context) {
	var entries = this._entries;
	var key;

	for (key in entries) {
		if (entries.hasOwnProperty(key)) {
			callback.call(context, entries[key], key, this);
		}
	}

	return this;
};

/**
 * iterator over `kind`
 * @method iterator
 * @param {String} kind
 * @return {HashIterator}
**/
Hash.prototype.iterator = function (kind) {
	return new HashIterator(this, kind);
};

/**
 * iterator over keys
 * @method keys
 * @return {HashIterator}
**/
Hash.prototype.keys = function () {
	return this.iterator('key');
};

/**
 * iterator over values
 * @method values
 * @return {HashIterator}
**/
Hash.prototype.values = function () {
	return this.iterator('value');
};

/**
 * iterator over entries
 * @method entries
 * @return {HashIterator}
**/
Hash.prototype.entries = Hash.prototype.__iterator__ = function () {
	return this.iterator('key+value');
};







/**
 * @class HashIterator
 * @constructor
 * @param {Hash} hash
 * @param {String} kind
 * @return {HastIterator}
**/
function HashIterator (hash, kind) {
	this._entries = hash._entries;
	this._kind = kind;
	this._index = 0;
	this._keys = [];
	var key;

	for (key in this._entries) {
		this._keys.push(key);
	}
}

/**
 * iterate over key/value/entry
 * @method next
 * @param {String} key
 * @return {Boolean}
**/
HashIterator.prototype.next = function () {
	var key = this._keys[this._index] !== undefined ? this._keys[this._index] : null;
	var value = this._entries[this._keys[this._index]] !== undefined ? this._entries[this._keys[this._index]] : null;

	this._index++;
			
	switch (this._kind) {
		case 'key':
			return key;
		break;
		case 'value':
			return value;
		break;
		case 'key+value':
			return (key !== null || value !== null) ? [key, value] : null;
	}
};
});
require.alias("hash/index.js", "hash/index.js");if (typeof exports == "object") {
  module.exports = require("hash");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("hash"); });
} else {
  this["Hash"] = require("hash");
}})();