module.exports = Hash;

/**
 * @class Hash
 * @constructor
 * @param {Object} object
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
 * @chainable
 * @param {String} key
 * @param {any} value
 * @return {hash}
**/
Hash.prototype.set = function (key, value) {
	this._entries[key] = value;
	
	return this;
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
 * entry existence
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
 * @return {any}
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