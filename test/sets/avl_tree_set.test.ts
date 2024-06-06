import { expect } from 'chai';
import { Generators } from 'ts-fluent-iterators';
import { AvlTreeSet, OverflowException, shuffle } from '../../src';

describe('AvlTreeSet', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const set = new AvlTreeSet();
      expect(set.capacity()).equal(Infinity);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(Infinity);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const set = AvlTreeSet.create({ capacity: 2 });
      expect(set.capacity()).equal(2);
      expect(set.size()).equal(0);
      expect(set.remaining()).equal(2);
      expect(set.isEmpty()).to.be.true;
      expect(set.isFull()).to.be.false;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [2, 1, 3];
      const set = AvlTreeSet.create({ capacity: arr.length, initial: arr });
      expect(set.capacity()).equal(arr.length);
      expect(set.size()).equal(arr.length);
      expect(set.remaining()).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should be identical to the AvlTreeSet argument', () => {
      const arr = [3, 1, 2];
      const set1 = AvlTreeSet.create({ capacity: arr.length, initial: arr });
      expect(set1.capacity()).equal(arr.length);
      const set2 = AvlTreeSet.create({ initial: set1 });
      expect(set2.capacity()).equal(arr.length);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(set1.toArray());
    });

    it('should be identical to the Collection argument', () => {
      const arr = [2, 1, 3];
      const set1 = AvlTreeSet.create({ initial: arr });
      const set2 = AvlTreeSet.create({ initial: set1 });
      expect(set2.capacity()).equal(Infinity);
      expect(set1.equals(set2)).to.be.true;
      expect(set2.toArray()).to.deep.equal(arr.sort());
    });

    it('should use the function provided in the ArrayGenerator', () => {
      const arr = shuffle(Array.from({ length: 7 }, (_, i) => i + 1));
      const set = AvlTreeSet.create({ initial: { length: arr.length, seed: i => arr[i] } });
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should use the iterator provided in the ArrayGenerator', () => {
      const set = AvlTreeSet.create({ initial: { length: 10, seed: Generators.range() } });
      expect(set.size()).equal(10);
      expect(set.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayGenerator', () => {
      const arr = shuffle(Array.from({ length: 10 }, (_, i) => i));
      const set = AvlTreeSet.create({ initial: { length: arr.length, seed: arr } });
      expect(set.size()).equal(arr.length);
      expect(set.toArray()).to.deep.equal(arr.sort());
    });

    it('should throw if number of initial elements exceed capacity', () => {
      expect(() => AvlTreeSet.create({ capacity: 0, initial: { length: 10, seed: i => i + 1 } })).to.throw(
        OverflowException
      );
    });
  });

  describe('add', () => {
    it('should return false if element already present', () => {
      const set = new AvlTreeSet();
      expect(set.add(2)).to.be.true;
      expect(set.add(1)).to.be.true;
      expect(set.add(1)).to.be.false;
      expect(set.add(2)).to.be.false;
      expect(set.size()).equal(2);
      expect(set.toArray()).to.deep.equal([1, 2]);
    });
    it('should throw if full and element not present', () => {
      const set = AvlTreeSet.create({ capacity: 1 });
      expect(set.add(1)).to.be.true;
      expect(set.isFull()).to.be.true;
      expect(set.add(1)).to.be.false;
      expect(() => set.add(2)).to.throw(OverflowException);
      expect(set.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should refuse if full and element not present', () => {
      const set = AvlTreeSet.create({ capacity: 1 });
      expect(set.offer(1)).to.be.true;
      expect(set.offer(2)).to.be.false;
      expect(set.isFull()).to.be.true;
      expect(set.offer(1)).to.be.true;
      expect(set.size()).equal(1);
      expect(set.isFull()).to.be.true;
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new AvlTreeSet();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const set = AvlTreeSet.create({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
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
      const set = new AvlTreeSet();
      expect(set.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const set = AvlTreeSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const set = AvlTreeSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty set', () => {
      const set = new AvlTreeSet();
      expect(set.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const set = AvlTreeSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const set = AvlTreeSet.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(set.find(x => x >= 5)).to.be.greaterThanOrEqual(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty set', () => {
      const set = new AvlTreeSet();
      expect(set.removeItem(1)).to.be.false;
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const set = AvlTreeSet.create({ initial: arr });
      expect(set.removeItem(4)).to.be.false;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const set = AvlTreeSet.create({ initial: arr });
      expect(set.toArray()).to.deep.equal([0, 1, 2, 3]);
      expect(set.removeItem(0)).to.be.true;
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty set', () => {
      const set = new AvlTreeSet();
      expect(set.filter(i => i === 0)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const set = AvlTreeSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(0);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const set = AvlTreeSet.create({ initial: arr });
      expect(set.filter(i => i > 0)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(3);
      expect(set.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const set = AvlTreeSet.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(set.offerFully(data)).equal(0);
      expect(set.isEmpty()).to.be.true;
      expect(set.offerFully(AvlTreeSet.create({ initial: data }))).equal(0);
      expect(set.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = AvlTreeSet.create({ capacity: 6 });
      const data = [1, 2, 3, 1, 3, 2];
      expect(set.offerFully(data)).equal(3);
      expect(set.size()).equal(3);
      expect(set.offerFully(AvlTreeSet.create({ initial: [1, 2, 3, 4, 5, 6] }))).equal(3);
      expect(set.size()).equal(6);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const set = AvlTreeSet.create({ capacity: 2 });
      const data = [1, 2, 1, 2];
      expect(set.offerFully(data)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(2);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const set = AvlTreeSet.create({ capacity: 2 });
      const data = [2, 1, 2, 3];
      expect(set.offerPartially(data)).equal(2);
      expect(set.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const set = AvlTreeSet.create({ capacity: 6 });
      const data = [1, 1, 2, 2, 3, 4, 5];
      expect(set.offerPartially(data)).equal(5);
      expect(set.size()).equal(5);
      expect(set.offerPartially(AvlTreeSet.create({ initial: data }))).equal(0);
      expect(set.size()).equal(5);
    });
    it('should accept all the items if there is enough capacity remaining for distinct elements', () => {
      const set = AvlTreeSet.create({ capacity: 2 });
      const data = [2, 1, 1, 1, 2, 1, 2, 3, 4];
      expect(set.offerPartially(data)).equal(2);
      expect(set.isEmpty()).to.be.false;
      expect(set.size()).equal(2);
      expect(set.toArray()).to.deep.equal([1, 2]);
    });
  });

  describe('lastEntry/pollLastEntry/lastKey', () => {
    it('should return undefined on empty set', () => {
      const set = new AvlTreeSet();
      expect(set.last()).to.be.undefined;
      expect(set.pollLast()).to.be.undefined;
    });
    it('should return the last entry', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.last()).equal('b');
      expect(set.pollLast()).equal('b');
      expect(set.size()).equal(1);
    });
  });

  describe('first/pollFirst', () => {
    it('should return undefined on empty set', () => {
      const set = new AvlTreeSet();
      expect(set.first()).to.be.undefined;
      expect(set.pollFirst()).to.be.undefined;
    });
    it('should return the first item', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.first()).equal('a');
      expect(set.pollFirst()).equal('a');
      expect(set.size()).equal(1);
    });
  });

  describe('lower', () => {
    it('should resolve lower', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.lower('z')).equal('b');
      expect(set.lower('b')).equal('a');
      expect(set.lower('A')).to.be.undefined;
      expect(set.lower('a')).to.be.undefined;
    });
  });

  describe('higher', () => {
    it('should resolve lower', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.higher('a')).equal('b');
      expect(set.higher('A')).equal('a');
      expect(set.higher('z')).to.be.undefined;
      expect(set.higher('b')).to.be.undefined;
    });
  });

  describe('floorEntry', () => {
    it('should resolve floorEntry', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.floor('z')).equal('b');
      expect(set.floor('b')).equal('b');
      expect(set.floor('a')).equal('a');
      expect(set.floor('A')).to.be.undefined;
    });
  });

  describe('ceilingEntry', () => {
    it('should resolve floorEntry', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a'] });
      expect(set.ceiling('a')).equal('a');
      expect(set.ceiling('A')).equal('a');
      expect(set.ceiling('b')).equal('b');
      expect(set.ceiling('z')).to.be.undefined;
    });
  });

  describe('reverseIterator', () => {
    it('should iterate over all items in reverse order', () => {
      const set = AvlTreeSet.create({ initial: ['b', 'a', 'c'] });
      expect(set.reverseIterator().collect()).to.deep.equal(['c', 'b', 'a']);
    });
  });

  describe('toJSON', () => {
    it('should return the JSON string', () => {
      const set = AvlTreeSet.create({ initial: [4, 2, 1, 3, 2, 3, 4] });
      expect(set.toJSON()).equals('[1,2,3,4]');
    });
  });
});
