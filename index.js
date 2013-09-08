var properties = require('properties');
module.exports = Hash;

function Hash (object) {
	this._entries = {};

	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			this.set(key, object[key]);
		}
	}
}

Hash.prototype.get = function (key) {
	return this._entries[key];
};

Hash.prototype.set = function (key, value) {
	this._entries[key] = value;
};

Hash.prototype.delete = function (key) {
	if (this.has(key)) {
		delete this._entries[key];
		return true;
	}

	return false;
};

Hash.prototype.has = function (key) {
	return this._entries.hasOwnProperty(key);
};

Hash.prototype.clear = function () {
	var entries = this._entries;
	for (var key in entries) {
		if (entries.hasOwnProperty(key)) {
			delete entries[key];
		}
	}
};

Hash.prototype.forEach = function (callback, context) {
	var entries = this._entries;
	for (var key in entries) {
		if (entries.hasOwnProperty(key)) {
			callback.call(context, entries[key], key, this);
		}
	}
};

Hash.prototype.keys = function () {
	return new HashIterator(this, 'key');
};

Hash.prototype.values = function () {
	return new HashIterator(this, 'value');
};

Hash.prototype.entries = Hash.prototype.__iterator__ = function () {
	return new HashIterator(this, 'key+value');
};

Hash.prototype.iterator = function (kind) {
	return new HashIterator(this, kind);
};


properties(Hash.prototype)
	.default({ configurable: true })
	.property('get').value().define()
	.property('set').value().define()
	.property('delete').value().define()
	.property('has').value().define()
	.property('clear').value().define()
	.property('forEach').value().define()
	.property('size')
		.getter(function () {
			var counter = 0, entries = this._entries;
			for (var key in entries) {
				if (entries.hasOwnProperty(key)) { counter++; }
			}
			return counter;
		}).define()
	.property('keys').value().define()
	.property('values').value().define()
	.property('entries').value().define()
	.property('iterator').value().define()
	.property('__iterator__').value().define()
;







function HashIterator (hash, kind) {
	this._entries = hash._entries;
	this._kind = kind;
	this._index = 0;
	this._keys = [];

	for (var property in hash._entries) {
		this._keys.push(property);
	}
}

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

properties(HashIterator.prototype)
	.default({ configurable: true })
	.property('next').value().define()
;
