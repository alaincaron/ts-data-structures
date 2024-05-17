import { expect } from 'chai';
import { Comparators, iterator } from 'ts-fluent-iterators';
import { OverflowException, TrieMultiSet } from '../../src';

describe('TrieMultiSet', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const set = new TrieMultiSet();
      expect(set.capacity()).equal(Infinity);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(Infinity);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const set = TrieMultiSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(2);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const set = TrieMultiSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument', () => {
      const arr = ['foo', 'bar', 'foo'];
      const set = TrieMultiSet.create({ capacity: 3, initial: arr });
      expect(set.capacity()).equal(3);
      expect(set.size()).equal(3);
      expect(set.remaining()).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should be identical to the TrieMultiSet argument', () => {
      const arr = ['foo', 'bar', 'foo'];
      const set1 = TrieMultiSet.create({ capacity: 3, initial: arr });
      expect(set1.capacity()).equal(3);
      const set2 = TrieMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(3);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(set1.toArray().sort());
    });

    it('should be identical to the Collection argument', () => {
      const arr = ['foo', 'bar'];
      const set1 = TrieMultiSet.create({ initial: arr });
      const set2 = TrieMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(Infinity);
      expect(set2.toArray().sort()).to.deep.equal(arr.sort());
    });

    it('should respect the passed comparator', () => {
      const ms = new TrieMultiSet({ comparator: Comparators.reverseComparator });
      const barValue = 4;
      const fooValue = 5;
      ms.setCount('bar', barValue);
      ms.setCount('foo', fooValue);

      expect(ms.first()).equal('foo');
      expect(ms.firstEntry()).deep.equal({ key: 'foo', value: fooValue });

      expect(ms.last()).equal('bar');
      expect(ms.lastEntry()).deep.equal({ key: 'bar', value: barValue });
    });
  });

  describe('add', () => {
    it('should return true and increment count if element already present', () => {
      const set = new TrieMultiSet();
      expect(set.add('foo')).to.be.true;
      expect(set.add('foo')).to.be.true;
      expect(set.count('foo')).equals(2);
      expect(set.add('bar')).to.be.true;
      expect(set.add('bar')).to.be.true;
      expect(set.count('bar')).equals(2);
      expect(set.size()).equal(4);
      expect(set.toArray()).to.deep.equal(['bar', 'bar', 'foo', 'foo']);
    });
    it('should throw if full', () => {
      const set = TrieMultiSet.create({ capacity: 1 });
      expect(set.add('foo')).to.be.true;
      expect(set.isFull()).to.be.true;
      expect(() => set.add('foo')).to.throw(OverflowException);
      expect(set.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should refuse if full', () => {
      const set = TrieMultiSet.create({ capacity: 1 });
      expect(set.offer('foo')).to.be.true;
      expect(set.offer('bar')).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.offer('foo')).to.be.false;
      expect(set.size()).equal(1);
      expect(set.isFull()).to.be.true;
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new TrieMultiSet();
      const b = a.clone();
      expect(b instanceof TrieMultiSet).to.be.true;
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const set = TrieMultiSet.create({ capacity: 3, initial: ['foo', 'bar'] });
      expect(set.size()).to.equal(2);
      expect(set.remaining()).to.equal(1);
      set.clear();
      expect(set.size()).to.equal(0);
      expect(set.remaining()).to.equal(3);
      expect(set.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty set', () => {
      const set = new TrieMultiSet();
      expect(set.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const set = TrieMultiSet.create({ initial: ['foo', 'bar'] });
      expect(set.contains('foobar')).to.be.false;
    });
    it('should return true if present', () => {
      const set = TrieMultiSet.create({ initial: ['foo', 'bar'] });
      expect(set.contains('bar')).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty set', () => {
      const set = new TrieMultiSet();
      expect(set.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const set = TrieMultiSet.create({ initial: ['foo', 'bar'] });
      expect(set.find(x => x > 'foo')).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const set = TrieMultiSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(set.find(x => x.length >= 5)).equal('foobar');
    });
  });

  describe('removeItem', () => {
    it('should return false on empty set', () => {
      const set = new TrieMultiSet();
      expect(set.removeItem('foo')).to.be.false;
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = ['foo', 'bar', 'foobar'];
      const set = TrieMultiSet.create({ initial: arr });
      expect(set.removeItem('baz')).to.be.false;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove occurence and return true if item is present', () => {
      const arr = ['foo', 'bar', 'baz', 'bar', 'foobar'];
      const set = TrieMultiSet.create({ initial: arr });
      expect(set.count('bar')).equal(2);
      expect(set.toArray()).to.deep.equal(['bar', 'bar', 'baz', 'foo', 'foobar']);
      expect(set.removeItem('bar')).to.be.true;
      expect(set.count('bar')).equal(1);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(4);
      expect(set.toArray()).deep.equal(['bar', 'baz', 'foo', 'foobar']);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty set', () => {
      const set = new TrieMultiSet();
      expect(set.filter(s => s === 'foobar')).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = ['bar', 'baz', 'foo'];
      const set = TrieMultiSet.create({ initial: arr });
      expect(set.filter(s => s.length === 3)).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = ['z', 'a', 'b', 'w', 'c'];
      const set = TrieMultiSet.create({ initial: arr });
      expect(set.filter(s => s < 'k')).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray()).deep.equal(['a', 'b', 'c']);
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const set = TrieMultiSet.create({ capacity: 2 });
      const data = ['foo', 'bar', 'foobar'];
      expect(set.offerFully(data)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.offerFully(TrieMultiSet.create({ initial: data }))).equal(0);
      expect(set.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = TrieMultiSet.create({ capacity: 6 });
      const data = ['foo', 'bar', 'foobar', 'bar', 'foobar', 'foo'];
      expect(set.offerFully(data)).equal(6);
      expect(set.size()).equal(6);
      expect(set.offerFully(TrieMultiSet.create({ initial: ['foo', 'bar', 'foobar'] }))).equal(0);
      expect(set.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const set = TrieMultiSet.create({ capacity: 2 });
      const data = ['foo', 'bar', 'foobar'];
      expect(set.offerPartially(data)).equal(2);
      expect(set.toArray()).to.deep.equal(['bar', 'foo']);
      set.clear();
      expect(set.offerPartially(TrieMultiSet.create({ initial: data }))).equal(2);
      expect(set.toArray()).to.deep.equal(['bar', 'foo']);
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = TrieMultiSet.create({ capacity: 6 });
      const data = ['bar', 'bar', 'foo', 'baz', 'foobar', 'foo'];
      expect(set.offerPartially(data)).equal(6);
      expect(set.count('not_present')).equal(0);
      expect(set.size()).equal(6);
      expect(set.offerPartially(TrieMultiSet.create({ initial: data }))).equal(0);
      expect(set.size()).equal(6);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const data = ['foo', 'foo', 'foo', 'bar', 'baz', 'foobar', 'bar', 'baz'];
      const set = TrieMultiSet.create({ capacity: data.length });
      expect(set.offerPartially(data)).equal(data.length);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(data.length);
      expect(set.toArray()).to.deep.equal(data.sort());
    });
  });

  describe('toJSON', () => {
    it('should return the JSON string', () => {
      const set = TrieMultiSet.create({ initial: ['foo', 'bar', 'foobar'] });
      const set2 = TrieMultiSet.create({ initial: JSON.parse(set.toJSON()) });
      expect(set.equals(set2)).to.be.true;
    });
  });

  describe('setCount', () => {
    it('should remove items when set to 0', () => {
      const ms = TrieMultiSet.create({ initial: ['foo', 'bar', 'foo'] });
      expect(ms.setCount('foo', 0)).equal(2);
      expect(ms.count('foo')).equals(0);
      expect(ms.contains('foo')).to.be.false;
      expect(ms.size()).equal(1);
      expect(ms.isEmpty()).to.be.false;

      expect(ms.setCount('bar', 0)).equals(1);
      expect(ms.count('bar')).equals(0);
      expect(ms.contains('foo')).to.be.false;
      expect(ms.size()).equals(0);
      expect(ms.isEmpty()).to.be.true;

      expect(ms.setCount('foobar', 0)).equal(0);
      expect(ms.count('foobar')).equal(0);
      expect(ms.isEmpty()).to.be.true;
    });

    it('should increase the size if new count is greater', () => {
      const ms = TrieMultiSet.create({ initial: ['foo'] });
      expect(ms.setCount('foo', 5)).equal(1);
      expect(ms.size()).equal(5);
      expect(ms.count('foo')).equal(5);
      expect(ms.setCount('bar', 6)).equal(0);
      expect(ms.size()).equal(11);
      expect(ms.count('bar')).equal(6);
    });

    it('should decrease the size if new count is smaller', () => {
      const ms = TrieMultiSet.create({ initial: ['foo', 'foo'] });
      expect(ms.setCount('foo', 1)).equal(2);
      expect(ms.size()).equal(1);
      expect(ms.count('foo')).equal(1);
    });

    it('should throw if not enough remaining capacity for new count', () => {
      const ms = TrieMultiSet.create({ capacity: 5 });
      expect(ms.setCount('foo', 4)).equal(0);
      expect(ms.add('bar')).to.be.true;
      expect(() => ms.setCount('foo', 5)).to.throw(OverflowException);
      expect(() => ms.add('bar')).to.throw(OverflowException);
      expect(ms.size()).equal(5);
      expect(ms.isFull()).to.be.true;
    });
  });

  describe('removeMatchingItem', () => {
    it('should remove item matching predicate', () => {
      const ms = TrieMultiSet.create({ initial: ['foo', 'bar', 'foo'] });

      expect(ms.removeMatchingItem(x => x.startsWith('f'))).equal('foo');
      expect(ms.size()).equal(2);
      expect(ms.count('foo')).equal(1);

      expect(ms.removeMatchingItem(x => !x.startsWith('f'))).equal('bar');
      expect(ms.size()).equal(1);
      expect(ms.count('bar')).equal(0);

      expect(ms.removeMatchingItem(x => x.length > 5)).to.be.undefined;
      expect(ms.size()).equal(1);
    });
  });

  describe('navigation methods', () => {
    it('should return undefined on empty multiset', () => {
      const multiset = new TrieMultiSet();
      expect(multiset.firstEntry()).to.be.undefined;
      expect(multiset.lastEntry()).to.be.undefined;
      expect(multiset.reverseEntryIterator().collect()).to.deep.equal([]);
    });

    it('should return right navigation values', () => {
      const ms = new TrieMultiSet();
      const barValue = 4;
      const fooValue = 5;
      ms.setCount('bar', barValue);
      ms.setCount('foo', fooValue);

      expect(ms.first()).equal('bar');
      expect(ms.firstEntry()).to.deep.equal({ key: 'bar', value: barValue });

      expect(ms.last()).equal('foo');
      expect(ms.lastEntry()).to.deep.equal({ key: 'foo', value: fooValue });

      expect(ms.reverseEntryIterator().collect()).to.deep.equal([
        { key: 'foo', value: fooValue },
        { key: 'bar', value: barValue },
      ]);

      expect(ms.reverseIterator().collect()).to.deep.equal(['foo', 'bar']);
    });
  });

  describe('getHeight', () => {
    it('should return 0 on empty multiset', () => {
      const multiset = new TrieMultiSet();
      expect(multiset.getHeight()).equal(0);
    });
    it('should return the length of the longest world', () => {
      const multiset = TrieMultiSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(multiset.getHeight()).equal(6);
    });
  });

  describe('hasPrefix', () => {
    it('should return false on empty multiset', () => {
      const multiset = new TrieMultiSet();
      expect(multiset.hasPrefix('')).to.be.false;
      expect(multiset.hasPrefix('', false)).to.be.false;
      expect(multiset.hasPrefix('foo')).to.be.false;
      expect(multiset.hasPrefix('foo', false)).to.be.false;
    });
    it('should respect pure prefix setting', () => {
      const multiset = TrieMultiSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(multiset.hasPrefix('')).to.be.true;
      expect(multiset.hasPrefix('', false)).to.be.true;
      expect(multiset.hasPrefix('foo')).to.be.true;
      expect(multiset.hasPrefix('foo', false)).to.be.true;
      expect(multiset.hasPrefix('bar')).to.be.false;
      expect(multiset.hasPrefix('bar', false)).to.be.true;
    });
  });

  describe('hasCommonPrefix', () => {
    it('should return false on empty multiset', () => {
      const multiset = new TrieMultiSet();
      expect(multiset.hasCommonPrefix('')).to.be.false;
      expect(multiset.hasCommonPrefix('foo')).to.be.false;
    });
    it('should verify for common prefix', () => {
      const multiset = TrieMultiSet.create({ initial: ['foo', 'foobar'] });
      expect(multiset.hasCommonPrefix('')).to.be.true;
      expect(multiset.hasCommonPrefix('f')).to.be.true;
      expect(multiset.hasCommonPrefix('fo')).to.be.true;
      expect(multiset.hasCommonPrefix('foo')).to.be.true;
      expect(multiset.hasCommonPrefix('foob')).to.be.false;
      expect(multiset.hasCommonPrefix('fa')).to.be.false;
      expect(multiset.hasCommonPrefix('b')).to.be.false;

      multiset.add('bar');
      expect(multiset.hasCommonPrefix('')).to.be.true;
      expect(multiset.hasCommonPrefix('b')).to.be.false;
    });
  });

  describe('getLongestCommonPrefix', () => {
    it('should empty string on empty multiset', () => {
      const multiset = new TrieMultiSet();
      expect(multiset.getLongestCommonPrefix()).equal('');
    });
    it('should return longest common prefix', () => {
      const multiset = TrieMultiSet.create({ initial: ['foo', 'foobar'] });
      expect(multiset.getLongestCommonPrefix()).equal('foo');

      multiset.add('fizz');
      expect(multiset.getLongestCommonPrefix()).equal('f');

      multiset.add('bar');
      expect(multiset.getLongestCommonPrefix()).equal('');
    });
  });

  describe('word/wordIterator', () => {
    it('should iterate over all words with specified prefix', () => {
      const multiset = TrieMultiSet.create({ initial: ['foo', 'foobar', 'bar', 'baz', 'fizz'] });
      expect(iterator(multiset.words('f')).collect()).deep.equal(['fizz', 'foo', 'foobar']);
      expect(iterator(multiset.words('fo')).collect()).deep.equal(['foo', 'foobar']);
      expect(iterator(multiset.words('b')).collect()).deep.equal(['bar', 'baz']);
      expect(iterator(multiset.words('')).collect()).deep.equal(['bar', 'baz', 'fizz', 'foo', 'foobar']);

      expect(multiset.wordIterator('f').collect()).deep.equal(['fizz', 'foo', 'foobar']);
      expect(multiset.wordIterator('fo').collect()).deep.equal(['foo', 'foobar']);
      expect(multiset.wordIterator('b').collect()).deep.equal(['bar', 'baz']);
      expect(multiset.wordIterator('').collect()).deep.equal(['bar', 'baz', 'fizz', 'foo', 'foobar']);
    });
  });
});
