import { expect } from 'chai';
import { Generators } from 'ts-fluent-iterators';
import { HeapUtils, OverflowException, PriorityQueue, qsort, UnderflowException } from '../../src';

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const queue = new PriorityQueue();
      expect(queue.capacity()).equal(Infinity);
      expect(queue.size()).equal(0);
      expect(queue.remaining()).equal(Infinity);
      expect(queue.isEmpty()).to.be.true;
      expect(queue.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const queue = PriorityQueue.create({ capacity: 2 });
      expect(queue.capacity()).equal(2);
      expect(queue.size()).equal(0);
      expect(queue.remaining()).equal(2);
      expect(queue.isEmpty()).to.be.true;
      expect(queue.isFull()).to.be.false;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2];
      const queue = PriorityQueue.create({ capacity: 2, initial: arr });
      expect(queue.capacity()).equal(2);
      expect(queue.size()).equal(2);
      expect(queue.remaining()).equal(0);
      expect(queue.isEmpty()).to.be.false;
      expect(queue.isFull()).to.be.true;
      expect(queue.toArray()).to.deep.equal(arr);
    });

    it('should be identical to the PriorityQueue argument', () => {
      const arr = [1, 2];
      const queue1 = PriorityQueue.create({ capacity: 3, initial: arr });
      expect(queue1.capacity()).equal(3);
      const queue2 = PriorityQueue.create({ initial: queue1 });
      expect(queue2).to.deep.equal(queue1);
      expect(queue2.capacity()).equal(3);
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const queue1 = PriorityQueue.create({ initial: arr });
      const queue2 = PriorityQueue.create({ initial: queue1 });
      expect(queue2.capacity()).equal(Infinity);
      expect(queue2.toArray()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const queue = PriorityQueue.create({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(queue.toArray()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayGenerator', () => {
      const queue = PriorityQueue.create({ initial: { length: 10, seed: Generators.range() } });
      expect(queue.size()).equal(10);
      expect(queue.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const queue = PriorityQueue.create({ initial: { length: 10, seed: arr } });
      expect(queue.size()).equal(2);
      expect(queue.toArray()).to.deep.equal(arr);
    });

    it('should throw if number of initial elements exceed capacity', () => {
      expect(() => PriorityQueue.create({ capacity: 5, initial: { length: 10, seed: i => i + 1 } })).to.throw(
        OverflowException
      );
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new PriorityQueue();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('ordering', () => {
    it('should remove object according to sort order', () => {
      const queue = PriorityQueue.create({ capacity: 2 });
      queue.add('foo');
      queue.add('bar');
      expect(queue.size()).equal(2);
      expect(() => queue.add('foobar')).to.throw(OverflowException);
      expect(queue.peek()).equal('bar');
      expect(queue.remove()).equal('bar');
      expect(queue.peek()).equal('foo');
      expect(queue.poll()).equal('foo');
      expect(queue.peek()).to.be.undefined;
      expect(queue.poll()).to.be.undefined;
      expect(queue.isEmpty()).to.be.true;
      expect(() => queue.remove()).to.throw(UnderflowException);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const queue = PriorityQueue.create({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
      expect(queue.size()).to.equal(2);
      expect(queue.remaining()).to.equal(1);
      queue.clear();
      expect(queue.size()).to.equal(0);
      expect(queue.remaining()).to.equal(3);
      expect(queue.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty queue', () => {
      const queue = new PriorityQueue();
      expect(queue.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const queue = PriorityQueue.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(queue.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const queue = PriorityQueue.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(queue.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty queue', () => {
      const queue = new PriorityQueue();
      expect(queue.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const queue = PriorityQueue.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(queue.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const queue = PriorityQueue.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(queue.find(x => x >= 5)).equal(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty queue', () => {
      const queue = new PriorityQueue();
      expect(queue.removeItem(1)).to.be.false;
      expect(queue.isEmpty()).to.be.true;
      expect(queue.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const queue = PriorityQueue.create({ initial: arr });
      expect(queue.removeItem(4)).to.be.false;
      expect(queue.isEmpty()).to.be.false;
      expect(queue.size()).equal(3);
    });
    it('should remove first occurrence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const queue = PriorityQueue.create({ initial: arr });
      expect(queue.removeItem(0)).to.be.true;
      expect(queue.isEmpty()).to.be.false;
      expect(queue.size()).equal(4);
      expect(HeapUtils.isHeap(queue.toArray())).to.be.true;
      expect(Array.from(queue.drain())).to.deep.equal([0, 1, 2, 3]);
      expect(queue.isEmpty()).to.be.true;
    });
  });

  describe('filter', () => {
    it('should return 0 on empty queue', () => {
      const queue = new PriorityQueue();
      expect(queue.filter(i => i === 0)).equal(0);
      expect(queue.isEmpty()).to.be.true;
      expect(queue.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const queue = PriorityQueue.create({ initial: arr });
      expect(queue.filter(i => i > 0)).equal(0);
      expect(queue.isEmpty()).to.be.false;
      expect(queue.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const queue = PriorityQueue.create({ initial: arr });
      expect(queue.filter(i => i > 0)).equal(2);
      expect(queue.isEmpty()).to.be.false;
      expect(queue.size()).equal(3);
      expect(HeapUtils.isHeap(queue.toArray())).to.be.true;
      expect(Array.from(queue.drain())).to.deep.equal([1, 2, 3]);
      expect(queue.isEmpty()).to.be.true;
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const queue = PriorityQueue.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(queue.offerFully(data)).equal(0);
      expect(queue.isEmpty()).to.be.true;
      expect(queue.offerFully(PriorityQueue.create({ initial: data }))).equal(0);
      expect(queue.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const queue = PriorityQueue.create({ capacity: 6 });
      const data = [1, 2, 3];
      expect(queue.offerFully(data)).equal(3);
      expect(queue.size()).equal(3);
      expect(queue.offerFully(PriorityQueue.create({ initial: data }))).equal(3);
      expect(queue.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const queue = PriorityQueue.create({ capacity: 2 });
      const data = [1, 2, 3];
      expect(queue.offerPartially(data)).equal(2);
      expect(queue.toArray()).to.deep.equal([1, 2]);
      queue.clear();
      expect(queue.offerPartially(PriorityQueue.create({ initial: data }))).equal(2);
      expect(queue.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const queue = PriorityQueue.create({ capacity: 6 });
      const data = [1, 2, 3];
      expect(queue.offerPartially(data)).equal(3);
      expect(queue.size()).equal(3);
      expect(queue.offerPartially(PriorityQueue.create({ initial: data }))).equal(3);
      expect(queue.size()).equal(6);
    });
  });

  describe('equals/hashCode', () => {
    it('should return true for same queue', () => {
      const queue = PriorityQueue.create({ initial: [1, 2] });
      expect(queue.equals(queue)).to.be.true;
      const cl = queue.clone();
      expect(queue.equals(cl)).to.be.false;
      expect(queue.hashCode() === cl.hashCode());
    });
  });

  describe('queueIterator', () => {
    it('should remove elements in the right order', () => {
      const a = Array.from({ length: 200 }, (_, i) => i);
      const b = a.slice(0).shuffle();
      const queue = PriorityQueue.create({ initial: b });
      const iterator = queue.queueIterator();
      let i = 0;
      for (;;) {
        const item = iterator.next();
        expect(item.done).equal(i === a.length);
        if (item.done) break;
        expect(item.value).equal(a[i]);
        expect(iterator.remove()).equal(a[i]);
        ++i;
      }
      expect(i).equal(a.length);
      expect(queue.size()).equal(0);
    });
    it('should not allow 2nd remove after next', () => {
      const a = [3, 2, 1, 2];
      const queue = PriorityQueue.create({ initial: a });
      const iterator = queue.queueIterator();
      const item = iterator.next();
      expect(item.done).to.be.false;
      expect(item.value).equal(1);
      expect(iterator.remove()).equal(1);
      expect(() => iterator.remove()).to.throw(Error);
      qsort(a).shift();
      expect(queue.toArray()).deep.equal(a);
    });
  });

  describe('reverseQueueIterator', () => {
    it('should remove elements in the right order', () => {
      const a = Array.from({ length: 200 }, (_, i) => i);
      const b = a.slice(0).shuffle();
      const queue = PriorityQueue.create({ initial: b });
      const iterator = queue.reverseQueueIterator();
      let i = 0;
      for (;;) {
        const item = iterator.next();
        expect(item.done).equal(i === a.length);
        if (item.done) break;
        const v = a[a.length - i - 1];
        expect(item.value).equal(v);
        expect(iterator.remove()).equal(v);
        ++i;
      }
      expect(i).equal(a.length);
      expect(queue.size()).equal(0);
    });
    it('should not allow 2nd remove after next', () => {
      const a = [2, 3, 2, 1];
      const queue = PriorityQueue.create({ initial: a });
      const iterator = queue.reverseQueueIterator();
      const item = iterator.next();
      expect(item.done).to.be.false;
      expect(item.value).equal(3);
      expect(iterator.remove()).equal(3);
      expect(() => iterator.remove()).to.throw(Error);
      qsort(a).pop();
      expect(queue.toArray()).deep.equal(a);
    });
  });
});
