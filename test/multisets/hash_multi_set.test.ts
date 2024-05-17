import { expect } from 'chai';
import { Generators } from 'ts-fluent-iterators';
import { HashMultiSet, OverflowException } from '../../src';

describe('HashMultiSet', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const set = new HashMultiSet();
      expect(set.capacity()).equal(Infinity);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(Infinity);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const set = HashMultiSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(2);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const set = HashMultiSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2, 1];
      const set = HashMultiSet.create({ capacity: 3, initial: arr });
      expect(set.capacity()).equal(3);
      expect(set.size()).equal(3);
      expect(set.remaining()).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.toArray().sort()).to.deep.equal(arr.sort());
    });

    it('should be identical to the HashMultiSet argument', () => {
      const arr = [1, 2, 1];
      const set1 = HashMultiSet.create({ capacity: 3, initial: arr });
      expect(set1.capacity()).equal(3);
      const set2 = HashMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(3);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray().sort()).to.deep.equal(set1.toArray().sort());
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const set1 = HashMultiSet.create({ initial: arr });
      const set2 = HashMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(Infinity);
      expect(set2.toArray().sort()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const set = HashMultiSet.create({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(set.toArray().sort()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayGenerator', () => {
      const set = HashMultiSet.create({ initial: { length: 10, seed: Generators.range() } });
      expect(set.size()).equal(10);
      expect(set.toArray().sort()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const set = HashMultiSet.create({ initial: { length: 10, seed: arr } });
      expect(set.size()).equal(2);
      expect(set.toArray().sort()).to.deep.equal(arr);
    });

    it('should throw if number of initial elements exceed capacity', () => {
      expect(() => HashMultiSet.create({ capacity: 0, initial: { length: 10, seed: i => i + 1 } })).to.throw(
        OverflowException
      );
    });
  });

  describe('add', () => {
    it('should return true and increment count if element already present', () => {
      const set = new HashMultiSet();
      expect(set.add(1)).to.be.true;
      expect(set.add(1)).to.be.true;
      expect(set.count(1)).equals(2);
      expect(set.add(2)).to.be.true;
      expect(set.add(2)).to.be.true;
      expect(set.count(2)).equals(2);
      expect(set.size()).equal(4);
      expect(set.toArray().sort()).to.deep.equal([1, 1, 2, 2]);
    });
    it('should throw if full', () => {
      const set = HashMultiSet.create({ capacity: 1 });
      expect(set.add(1)).to.be.true;
      expect(set.isFull()).to.be.true;
      expect(() => set.add(1)).to.throw(OverflowException);
      expect(set.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should refuse if full', () => {
      const set = HashMultiSet.create({ capacity: 1 });
      expect(set.offer(1)).to.be.true;
      expect(set.offer(2)).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.offer(1)).to.be.false;
      expect(set.size()).equal(1);
      expect(set.isFull()).to.be.true;
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new HashMultiSet();
      const b = a.clone();
      expect(b instanceof HashMultiSet).to.be.true;
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const set = HashMultiSet.create({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
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
      const set = new HashMultiSet();
      expect(set.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const set = HashMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const set = HashMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty set', () => {
      const set = new HashMultiSet();
      expect(set.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const set = HashMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const set = HashMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 5)).to.be.greaterThanOrEqual(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty set', () => {
      const set = new HashMultiSet();
      expect(set.removeItem(1)).to.be.false;
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const set = HashMultiSet.create({ initial: arr });
      expect(set.removeItem(4)).to.be.false;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const set = HashMultiSet.create({ initial: arr });
      expect(set.count(0)).equal(2);
      expect(set.toArray().sort()).to.deep.equal([0, 0, 1, 2, 3]);
      expect(set.removeItem(0)).to.be.true;
      expect(set.count(0)).equal(1);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(4);
      expect(set.toArray().sort()).deep.equal([0, 1, 2, 3]);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty set', () => {
      const set = new HashMultiSet();
      expect(set.filter(i => i === 0)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const set = HashMultiSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const set = HashMultiSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray().sort()).deep.equal([1, 2, 3]);
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const set = HashMultiSet.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(set.offerFully(data)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.offerFully(HashMultiSet.create({ initial: data }))).equal(0);
      expect(set.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = HashMultiSet.create({ capacity: 6 });
      const data = [1, 2, 3, 1, 3, 2];
      expect(set.offerFully(data)).equal(6);
      expect(set.size()).equal(6);
      expect(set.offerFully(HashMultiSet.create({ initial: [1, 2, 3, 4, 5, 6] }))).equal(0);
      expect(set.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const set = HashMultiSet.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(set.offerPartially(data)).equal(2);
      expect(set.toArray().sort()).to.deep.equal([1, 2]);
      set.clear();
      expect(set.offerPartially(HashMultiSet.create({ initial: data }))).equal(2);
      expect(set.toArray().sort()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = HashMultiSet.create({ capacity: 6 });
      const data = [1, 1, 2, 2, 3, 4, 5];
      expect(set.offerPartially(data)).equal(6);
      expect(set.count(5)).equal(0);
      expect(set.size()).equal(6);
      expect(set.offerPartially(HashMultiSet.create({ initial: data }))).equal(0);
      expect(set.size()).equal(6);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const data = [1, 1, 1, 2, 1, 2, 3, 4];
      const set = HashMultiSet.create({ capacity: data.length });
      expect(set.offerPartially(data)).equal(data.length);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(data.length);
      expect(set.toArray().sort()).to.deep.equal(data.sort());
    });
  });

  describe('toJSON', () => {
    it('should return the JSON string', () => {
      const set = HashMultiSet.create({ initial: [1, 2, 3, 4, { x: true }, 'alain'] });
      const set2 = HashMultiSet.create({ initial: JSON.parse(set.toJSON()) });
      expect(set.equals(set2)).to.be.true;
    });
  });

  describe('setCount', () => {
    it('should remove items when set to 0', () => {
      const ms = HashMultiSet.create({ initial: ['foo', 'bar', 'foo'] });
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
      const ms = HashMultiSet.create({ initial: ['foo'] });
      expect(ms.setCount('foo', 5)).equal(1);
      expect(ms.size()).equal(5);
      expect(ms.count('foo')).equal(5);
      expect(ms.setCount('bar', 6)).equal(0);
      expect(ms.size()).equal(11);
      expect(ms.count('bar')).equal(6);
    });

    it('should decrease the size if new count is smaller', () => {
      const ms = HashMultiSet.create({ initial: ['foo', 'foo'] });
      expect(ms.setCount('foo', 1)).equal(2);
      expect(ms.size()).equal(1);
      expect(ms.count('foo')).equal(1);
    });

    it('should throw if not enough remaining capacity for new count', () => {
      const ms = HashMultiSet.create({ capacity: 5 });
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
      const ms = HashMultiSet.create({ initial: ['foo', 'bar', 'foo'] });

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
});
