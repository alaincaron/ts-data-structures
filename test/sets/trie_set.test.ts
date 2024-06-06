import { expect } from 'chai';
import { iterator } from 'ts-fluent-iterators';
import { OverflowException, TrieSet } from '../../src';

describe('TrieSet', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const set = new TrieSet();
      expect(set.capacity()).equal(Infinity);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(Infinity);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const set = TrieSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(2);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have the same elements as the array argument', () => {
      const arr = ['foo', 'bar', 'foobar'];
      const set = TrieSet.create({ capacity: arr.length, initial: arr });
      expect(set.capacity()).equal(arr.length);
      expect(set.size()).equal(arr.length);
      expect(set.remaining()).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should be identical to the TrieSet argument', () => {
      const arr = ['foo', 'bar', 'foobar'];
      const set1 = TrieSet.create({ capacity: arr.length, initial: arr });
      expect(set1.capacity()).equal(arr.length);
      const set2 = TrieSet.create({ initial: set1 });
      expect(set2.capacity()).equal(arr.length);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(set1.toArray());
    });

    it('should be identical to the Collection argument', () => {
      const arr = ['foo', 'foobar', 'bar'];
      const set1 = TrieSet.create({ initial: arr });
      const set2 = TrieSet.create({ initial: set1 });
      expect(set2.capacity()).equal(Infinity);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(arr.sort());
    });
  });

  describe('add', () => {
    it('should return false if element already present', () => {
      const set = new TrieSet();
      expect(set.add('foo')).to.be.true;
      expect(set.add('bar')).to.be.true;
      expect(set.add('foo')).to.be.false;
      expect(set.add('bar')).to.be.false;
      expect(set.size()).equal(2);
      expect(set.toArray()).to.deep.equal(['bar', 'foo']);
    });
    it('should throw if full and element not present', () => {
      const set = TrieSet.create({ capacity: 1 });
      expect(set.add('foo')).to.be.true;
      expect(set.isFull()).to.be.true;
      expect(set.add('foo')).to.be.false;
      expect(() => set.add('bar')).to.throw(OverflowException);
      expect(set.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should refuse if full and element not present', () => {
      const set = TrieSet.create({ capacity: 1 });
      expect(set.offer('foo')).to.be.true;
      expect(set.offer('bar')).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.offer('foo')).to.be.true;
      expect(set.size()).equal(1);
      expect(set.isFull()).to.be.true;
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new TrieSet();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const set = TrieSet.create({ capacity: 3, initial: ['foo', 'bar'] });
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
      const set = new TrieSet();
      expect(set.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar'] });
      expect(set.contains('foobar')).to.be.false;
    });
    it('should return true if present', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar'] });
      expect(set.contains('foo')).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty set', () => {
      const set = new TrieSet();
      expect(set.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar'] });
      expect(set.find(x => x === 'foobar')).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(set.find(x => x.length >= 5)).equal('foobar');
    });
  });

  describe('removeItem', () => {
    it('should return false on empty set', () => {
      const set = new TrieSet();
      expect(set.removeItem('foobar')).to.be.false;
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = ['foo', 'bar', 'foobar'];
      const set = TrieSet.create({ initial: arr });
      expect(set.removeItem('baz')).to.be.false;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove occurence and return true if item is present', () => {
      const arr = ['foo', 'bar', 'baz', 'foo', 'foobar', 'baz', 'bar'];
      const set = TrieSet.create({ initial: arr });
      expect(set.toArray()).to.deep.equal(['bar', 'baz', 'foo', 'foobar']);
      expect(set.removeItem('baz')).to.be.true;
      expect(set.size()).equal(3);
      expect(set.toArray()).to.deep.equal(['bar', 'foo', 'foobar']);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty set', () => {
      const set = new TrieSet();
      expect(set.filter(s => s === 'foobar')).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = ['foo', 'bar', 'baz'];
      const set = TrieSet.create({ initial: arr });
      expect(set.filter(s => s.length === 3)).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = ['foo', 'bar', 'foobar', 'baz'];
      const set = TrieSet.create({ initial: arr });
      expect(set.filter(s => s.length <= 3)).equal(1);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray()).deep.equal(['bar', 'baz', 'foo']);
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const set = TrieSet.create({ capacity: 2 });
      const data = ['foo', 'bar', 'foobar'];
      expect(set.offerFully(data)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.offerFully(TrieSet.create({ initial: data }))).equal(0);
      expect(set.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = TrieSet.create({ capacity: 6 });
      const data = ['foo', 'bar', 'foobar', 'bar', 'foo', 'foobar'];
      expect(set.offerFully(data)).equal(3);
      expect(set.size()).equal(3);
      expect(set.offerFully(TrieSet.create({ initial: ['foo', '1', '2', '3'] }))).equal(3);
      expect(set.size()).equal(6);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const set = TrieSet.create({ capacity: 2 });
      const data = ['1', '2', '1', '2'];
      expect(set.offerFully(data)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(2);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const set = TrieSet.create({ capacity: 2 });
      const data = ['2', '1', '2', '3'];
      expect(set.offerPartially(data)).equal(2);
      expect(set.toArray()).to.deep.equal(['1', '2']);
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = TrieSet.create({ capacity: 6 });
      const data = ['1', '1', '2', '2', '3', '4', '5'];
      expect(set.offerPartially(data)).equal(5);
      expect(set.size()).equal(5);
      expect(set.offerPartially(TrieSet.create({ initial: data }))).equal(0);
      expect(set.size()).equal(5);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const set = TrieSet.create({ capacity: 2 });
      const data = ['2', '1', '1', '1', '2', '1', '2', '3', '4'];
      expect(set.offerPartially(data)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(2);
      expect(set.toArray()).to.deep.equal(['1', '2']);
    });
  });

  describe('toJSON', () => {
    it('should return the JSON string', () => {
      const set = TrieSet.create({ initial: ['foo', 'foobar', 'foo', 'baz', 'bar'] });
      expect(set.toJSON()).equals('["bar","baz","foo","foobar"]');
    });
  });

  describe('getHeight', () => {
    it('should return 0 on empty multiset', () => {
      const set = new TrieSet();
      expect(set.getHeight()).equal(0);
    });
    it('should return the length of the longest world', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(set.getHeight()).equal(6);
    });
  });

  describe('hasPrefix', () => {
    it('should return false on empty set', () => {
      const set = new TrieSet();
      expect(set.hasPrefix('')).to.be.false;
      expect(set.hasPrefix('', false)).to.be.false;
      expect(set.hasPrefix('foo')).to.be.false;
      expect(set.hasPrefix('foo', false)).to.be.false;
    });
    it('should respect pure prefix setting', () => {
      const set = TrieSet.create({ initial: ['foo', 'bar', 'foobar'] });
      expect(set.hasPrefix('')).to.be.true;
      expect(set.hasPrefix('', false)).to.be.true;
      expect(set.hasPrefix('foo')).to.be.true;
      expect(set.hasPrefix('foo', false)).to.be.true;
      expect(set.hasPrefix('bar')).to.be.false;
      expect(set.hasPrefix('bar', false)).to.be.true;
    });
  });

  describe('hasCommonPrefix', () => {
    it('should return false on empty set', () => {
      const set = new TrieSet();
      expect(set.hasCommonPrefix('')).to.be.false;
      expect(set.hasCommonPrefix('foo')).to.be.false;
    });
    it('should verify for common prefix', () => {
      const set = TrieSet.create({ initial: ['foo', 'foobar'] });
      expect(set.hasCommonPrefix('')).to.be.true;
      expect(set.hasCommonPrefix('f')).to.be.true;
      expect(set.hasCommonPrefix('fo')).to.be.true;
      expect(set.hasCommonPrefix('foo')).to.be.true;
      expect(set.hasCommonPrefix('foob')).to.be.false;
      expect(set.hasCommonPrefix('fa')).to.be.false;
      expect(set.hasCommonPrefix('b')).to.be.false;

      set.add('bar');
      expect(set.hasCommonPrefix('')).to.be.true;
      expect(set.hasCommonPrefix('b')).to.be.false;
    });
  });

  describe('getLongestCommonPrefix', () => {
    it('should empty string on empty set', () => {
      const set = new TrieSet();
      expect(set.getLongestCommonPrefix()).equal('');
    });
    it('should return longest common prefix', () => {
      const set = TrieSet.create({ initial: ['foo', 'foobar'] });
      expect(set.getLongestCommonPrefix()).equal('foo');

      set.add('fizz');
      expect(set.getLongestCommonPrefix()).equal('f');

      set.add('bar');
      expect(set.getLongestCommonPrefix()).equal('');
    });
  });

  describe('word/wordIterator', () => {
    it('should iterate over all words with specified prefix', () => {
      const set = TrieSet.create({ initial: ['foo', 'foobar', 'bar', 'baz', 'fizz'] });
      expect(iterator(set.words('f')).collect()).deep.equal(['fizz', 'foo', 'foobar']);
      expect(iterator(set.words('fo')).collect()).deep.equal(['foo', 'foobar']);
      expect(iterator(set.words('b')).collect()).deep.equal(['bar', 'baz']);
      expect(iterator(set.words('')).collect()).deep.equal(['bar', 'baz', 'fizz', 'foo', 'foobar']);

      expect(set.wordIterator('f').collect()).deep.equal(['fizz', 'foo', 'foobar']);
      expect(set.wordIterator('fo').collect()).deep.equal(['foo', 'foobar']);
      expect(set.wordIterator('b').collect()).deep.equal(['bar', 'baz']);
      expect(set.wordIterator('').collect()).deep.equal(['bar', 'baz', 'fizz', 'foo', 'foobar']);
    });
  });
});
