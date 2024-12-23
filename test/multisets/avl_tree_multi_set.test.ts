import { expect } from 'chai';
import { Comparators, Generators } from 'ts-fluent-iterators';
import { narrow } from './helper';
import { AvlTreeMultiSet, OverflowException } from '../../src';

describe('AvlTreeMultiSet', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const set = new AvlTreeMultiSet();
      expect(set.capacity()).equal(Infinity);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(Infinity);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const set = AvlTreeMultiSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(2);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2, 1];
      const set = AvlTreeMultiSet.create({ capacity: 3, initial: arr });
      expect(set.capacity()).equal(3);
      expect(set.size()).equal(3);
      expect(set.remaining()).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should be identical to the AvlTreeMultiSet argument', () => {
      const arr = [1, 2, 1];
      const set1 = AvlTreeMultiSet.create({ capacity: 3, initial: arr });
      expect(set1.capacity()).equal(3);
      const set2 = AvlTreeMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(3);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(set1.toArray().sort());
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const set1 = AvlTreeMultiSet.create({ initial: arr });
      const set2 = AvlTreeMultiSet.create({ initial: set1 });
      expect(set2.capacity()).equal(Infinity);
      expect(set2.toArray()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const set = AvlTreeMultiSet.create({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(set.toArray()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayGenerator', () => {
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: Generators.range() } });
      expect(set.size()).equal(10);
      expect(set.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: arr } });
      expect(set.size()).equal(2);
      expect(set.toArray()).to.deep.equal(arr);
    });

    it('should throw if number of initial elements exceed capacity', () => {
      expect(() => AvlTreeMultiSet.create({ capacity: 0, initial: { length: 10, seed: i => i + 1 } })).to.throw(
        OverflowException
      );
    });
  });

  describe('add', () => {
    it('should return true and increment count if element already present', () => {
      const set = AvlTreeMultiSet.create();
      expect(set.add(1)).to.be.true;
      expect(set.add(1)).to.be.true;
      expect(set.count(1)).equals(2);
      expect(set.add(2)).to.be.true;
      expect(set.add(2)).to.be.true;
      expect(set.count(2)).equals(2);
      expect(set.size()).equal(4);
      expect(set.toArray()).to.deep.equal([1, 1, 2, 2]);
    });
    it('should throw if full', () => {
      const set = AvlTreeMultiSet.create({ capacity: 1 });
      expect(set.add(1)).to.be.true;
      expect(set.isFull()).to.be.true;
      expect(() => set.add(1)).to.throw(OverflowException);
      expect(set.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should refuse if full', () => {
      const set = AvlTreeMultiSet.create({ capacity: 1 });
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
      const a = AvlTreeMultiSet.create();
      const b = a.clone();
      expect(b instanceof AvlTreeMultiSet).to.be.true;
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const set = AvlTreeMultiSet.create({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
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
      const set = new AvlTreeMultiSet();
      expect(set.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty set', () => {
      const set = new AvlTreeMultiSet();
      expect(set.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const set = AvlTreeMultiSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 5)).to.be.greaterThanOrEqual(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty set', () => {
      const set = new AvlTreeMultiSet();
      expect(set.removeItem(1)).to.be.false;
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const set = AvlTreeMultiSet.create({ initial: arr });
      expect(set.removeItem(4)).to.be.false;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const set = AvlTreeMultiSet.create({ initial: arr });
      expect(set.count(0)).equal(2);
      expect(set.toArray()).to.deep.equal([0, 0, 1, 2, 3]);
      expect(set.removeItem(0)).to.be.true;
      expect(set.count(0)).equal(1);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(4);
      expect(set.toArray()).deep.equal([0, 1, 2, 3]);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty set', () => {
      const set = new AvlTreeMultiSet();
      expect(set.filter(i => i === 0)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const set = AvlTreeMultiSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const set = AvlTreeMultiSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const set = AvlTreeMultiSet.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(set.offerFully(data)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.offerFully(AvlTreeMultiSet.create({ initial: data }))).equal(0);
      expect(set.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = AvlTreeMultiSet.create({ capacity: 6 });
      const data = [1, 2, 3, 1, 3, 2];
      expect(set.offerFully(data)).equal(6);
      expect(set.size()).equal(6);
      expect(set.offerFully(AvlTreeMultiSet.create({ initial: [1, 2, 3, 4, 5, 6] }))).equal(0);
      expect(set.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const set = AvlTreeMultiSet.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(set.offerPartially(data)).equal(2);
      expect(set.toArray()).to.deep.equal([1, 2]);
      set.clear();
      expect(set.offerPartially(AvlTreeMultiSet.create({ initial: data }))).equal(2);
      expect(set.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = AvlTreeMultiSet.create({ capacity: 6 });
      const data = [1, 1, 2, 2, 3, 4, 5];
      expect(set.offerPartially(data)).equal(6);
      expect(set.count(5)).equal(0);
      expect(set.size()).equal(6);
      expect(set.offerPartially(AvlTreeMultiSet.create({ initial: data }))).equal(0);
      expect(set.size()).equal(6);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const data = [1, 1, 1, 2, 1, 2, 3, 4];
      const set = AvlTreeMultiSet.create({ capacity: data.length });
      expect(set.offerPartially(data)).equal(data.length);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(data.length);
      expect(set.toArray()).to.deep.equal(data.sort());
    });
  });

  describe('toJSON', () => {
    it('should return the JSON string', () => {
      const set = AvlTreeMultiSet.create({ initial: [1, 2, 3, 4, { x: true }, 'alain'] });
      const set2 = AvlTreeMultiSet.create({ initial: JSON.parse(set.toJSON()) });
      expect(set.equals(set2)).to.be.true;
    });
  });

  describe('setCount', () => {
    it('should remove items when set to 0', () => {
      const ms = AvlTreeMultiSet.create({ initial: ['foo', 'bar', 'foo'] });
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
      const ms = AvlTreeMultiSet.create({ initial: ['foo'] });
      expect(ms.setCount('foo', 5)).equal(1);
      expect(ms.size()).equal(5);
      expect(ms.count('foo')).equal(5);
      expect(ms.setCount('bar', 6)).equal(0);
      expect(ms.size()).equal(11);
      expect(ms.count('bar')).equal(6);
    });

    it('should decrease the size if new count is smaller', () => {
      const ms = AvlTreeMultiSet.create({ initial: ['foo', 'foo'] });
      expect(ms.setCount('foo', 1)).equal(2);
      expect(ms.size()).equal(1);
      expect(ms.count('foo')).equal(1);
    });

    it('should throw if not enough remaining capacity for new count', () => {
      const ms = AvlTreeMultiSet.create({ capacity: 5 });
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
      const ms = AvlTreeMultiSet.create({ initial: ['foo', 'bar', 'foo'] });

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
    it('should return undefined on empty map', () => {
      const ms = new AvlTreeMultiSet<string>();
      expect(ms.firstEntry()).to.be.undefined;
      expect(ms.first()).to.be.undefined;
      expect(ms.lastEntry()).to.be.undefined;
      expect(ms.last()).to.be.undefined;
      expect(ms.lower('a')).to.be.undefined;
      expect(ms.lowerEntry('a')).to.be.undefined;
      expect(ms.higher('a')).to.be.undefined;
      expect(ms.higherEntry('a')).to.be.undefined;
      expect(ms.floor('a')).to.be.undefined;
      expect(ms.floorEntry('a')).to.be.undefined;
      expect(ms.ceiling('a')).to.be.undefined;
      expect(ms.ceilingEntry('a')).to.be.undefined;
      expect(ms.pollFirstEntry()).to.be.undefined;
      expect(ms.pollLastEntry()).to.be.undefined;
      expect(ms.reverseEntryIterator().collect()).to.deep.equal([]);
      expect(ms.reverseIterator().collect()).to.deep.equal([]);
    });

    it('should return right navigation values', () => {
      const ms = new AvlTreeMultiSet<string>();
      const barValue = 4;
      const fooValue = 5;
      ms.setCount('bar', barValue);
      ms.setCount('foo', fooValue);

      expect(ms.first()).equal('bar');
      expect(narrow(ms.firstEntry())).to.deep.equal({ key: 'bar', value: barValue });

      expect(ms.last()).equal('foo');
      expect(narrow(ms.lastEntry())).to.deep.equal({ key: 'foo', value: fooValue });

      expect(ms.lower('bar')).to.be.undefined;
      expect(narrow(ms.lowerEntry('bar'))).to.be.undefined;

      expect(ms.lower('baz')).equal('bar');
      expect(narrow(ms.lowerEntry('baz'))).to.deep.equal({ key: 'bar', value: barValue });

      expect(ms.higher('baz')).equal('foo');
      expect(narrow(ms.higherEntry('bar'))).to.deep.equal({ key: 'foo', value: fooValue });

      expect(ms.floor('bar')).equal('bar');
      expect(narrow(ms.floorEntry('bar'))).to.deep.equal({ key: 'bar', value: barValue });

      expect(ms.ceiling('baz')).equal('foo');
      expect(narrow(ms.ceilingEntry('baz'))).to.deep.equal({ key: 'foo', value: fooValue });

      expect(ms.reverseEntryIterator().map(narrow).collect()).to.deep.equal([
        { key: 'foo', value: fooValue },
        { key: 'bar', value: barValue },
      ]);

      expect(ms.reverseIterator().collect()).to.deep.equal(['foo', 'bar']);

      expect(ms.pollFirst()).equal('bar');
      expect(ms.pollLast()).equal('foo');

      expect(narrow(ms.pollFirstEntry())).deep.equal({ key: 'bar', value: barValue - 1 });
      expect(narrow(ms.pollLastEntry())).deep.equal({ key: 'foo', value: fooValue - 1 });
    });

    it('should respect the passed comparator', () => {
      const ms = new AvlTreeMultiSet<string>({ comparator: Comparators.reversed });
      const barValue = 4;
      const fooValue = 5;
      ms.setCount('bar', barValue);
      ms.setCount('foo', fooValue);

      expect(ms.first()).equal('foo');
      expect(narrow(ms.firstEntry())).deep.equal({ key: 'foo', value: fooValue });

      expect(ms.last()).equal('bar');
      expect(narrow(ms.lastEntry())).deep.equal({ key: 'bar', value: barValue });
    });
  });
});
