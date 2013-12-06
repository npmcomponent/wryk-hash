should = require 'chai' .should!
Hash = require '../build/'

describe 'new Hash(object)' (...) !->
	h = new Hash do
		'a': 'aa'
		'b': 'bb'

	it "should initialize key/value entries from object" !->
		h.get 'a' .should.be.equal 'aa'
		h.get 'b' .should.be.equal 'bb'

	describe '#get(key)' (...) !->
		it "should return the key value or undefined" !->
			h.get 'a' .should.be.equal 'aa'
			should.not.exist h.get 'z'

	describe '#set(key)' (...) !->
		it "should set a new key/value entry or override existing entry" !->
			h.set 'c' 'cc'
			h.get 'c' .should.be.equal 'cc'

	describe '#delete(key)' (...) !->
		it "should remove a new key/value entry" !->
			should.exist h.get 'c'
			h.delete 'c'
			should.not.exist h.get 'c'

		it "should return true if an entry are deleted" !->
			h.set 'c' 'cc'
			h.delete 'c' .should.be.true

		it "should return false if an entry not are deleted" !->
			h.delete 'c' .should.be.false


	describe '#has(key)' (...) !->
		it "should return true if key/value entry is defined" !->
			h.has 'a' .should.be.true

		it "should return false if key/value entry is not defined" !->
			h.has 'z' .should.be.false

	describe '#clear()' (...) !->
		it "should delete all key/value entries" !->
			h.clear!
			h.size.should.be.equal 0

	describe '#size' (...) !->
		it "should return the number of entries" !->
			h.size.should.be.equal 0
			h.set 'a' 'aa'
			h.size.should.be.equal 1

	describe '#forEach(callback [, context])' (...) !->
		it "should call callback for all entries with (value, key, hash)" !->
			h.set 'b' 'bb'
			h.set 'c' 'cc'

			counter = 0
			h.forEach (value, key, hash) !->
				counter++
				value.should.be.equal h.get key
				hash.should.be.equal h

			counter.should.be.equal h.size

		it "should use context as current context" !->
			context = {}
			h.forEach do
				!-> @should.be.equal context
				context

	describe '#keys()' (...) !->
		it "should return a hash keys iterator" !->
			iterator = h.keys!

			while (key = iterator.next!) != null
				h.has key .should.be.true

	describe '#values()' (...) !->
		it "should return a hash values iterator" !->
			iterator = h.values!

			while (value = iterator.next!) != null
				found = false

				h.forEach !-> found := true if it == value

				found.should.be.true	

	describe '#entries()' (...) !->
		it "should return a hash entries iterator" !->
			iterator = h.entries!

			while (entry = iterator.next!) != null
				[key, value] = entry
				h.get key .should.be.equal value