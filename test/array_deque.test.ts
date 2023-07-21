import { ArrayDeque, OverflowException, UnderflowException } from '../src';
import { expect } from 'chai';

function* generator(): IterableIterator<number> {
  let i = 0;
  for (;;) yield i++;
}

describe('ArrayDeque', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const deque = new ArrayDeque();
      expect(deque.capacity()).equal(Infinity);
      expect(deque.size()).equal(0);
      expect(deque.remaining()).equal(Infinity);
      expect(deque.isEmpty()).to.be.true;
      expect(deque.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const deque = new ArrayDeque(2);
      expect(deque.capacity()).equal(2);
      expect(deque.size()).equal(0);
      expect(deque.remaining()).equal(2);
      expect(deque.isEmpty()).to.be.true;
      expect(deque.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      expect(deque.capacity()).equal(2);
      expect(deque.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2];
      const deque = new ArrayDeque({ capacity: 2, initial: arr });
      expect(deque.capacity()).equal(2);
      expect(deque.size()).equal(2);
      expect(deque.remaining()).equal(0);
      expect(deque.isEmpty()).to.be.false;
      expect(deque.isFull()).to.be.true;
      expect(deque.toArray()).to.deep.equal(arr);
    });

    it('should be identical to the ArrayDeque argument', () => {
      const arr = [1, 2];
      const deque1 = new ArrayDeque({ capacity: 3, initial: arr });
      expect(deque1.capacity()).equal(3);
      const deque2 = new ArrayDeque(deque1);
      expect(deque2).to.deep.equal(deque1);
      expect(deque2.capacity()).equal(3);
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const deque1 = new ArrayDeque({ initial: arr });
      const deque2 = new ArrayDeque({ initial: deque1 });
      expect(deque2.capacity()).equal(Infinity);
      expect(deque2.toArray()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayLike', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const deque = new ArrayDeque({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(deque.toArray()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayLike', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: generator() } });
      expect(deque.size()).equal(10);
      expect(deque.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayLike', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const deque = new ArrayDeque({ initial: { length: 10, seed: arr } });
      expect(deque.size()).equal(2);
      expect(deque.toArray()).to.deep.equal(arr);
    });

    it('should expand capacity to match number of initial elements', () => {
      const deque = new ArrayDeque({ capacity: 0, initial: { length: 10, seed: i => i + 1 } });
      expect(deque.capacity()).equal(10);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new ArrayDeque();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('FIFO', () => {
    it('should behave as a FIFO with standard methods', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      deque.add('foo');
      deque.add('bar');
      expect(deque.size()).equal(2);
      expect(() => deque.add('foobar')).to.throw(OverflowException);
      expect(deque.remove()).equal('foo');
      expect(deque.remove()).equal('bar');
      expect(deque.poll()).to.be.undefined;
      expect(deque.isEmpty()).to.be.true;
      expect(() => deque.remove()).to.throw(UnderflowException);
    });
    it('should behave as a FIFO with addFirst/removeLast', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      deque.addFirst('foo');
      deque.addFirst('bar');
      expect(deque.size()).equal(2);
      expect(() => deque.addFirst('foobar')).to.throw(OverflowException);
      expect(deque.removeLast()).equal('foo');
      expect(deque.removeLast()).equal('bar');
      expect(deque.pollLast()).to.be.undefined;
      expect(deque.isEmpty()).to.be.true;
      expect(() => deque.removeLast()).to.throw(UnderflowException);
    });
    it('should behave as a FIFO with addLast/removeFirst', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      deque.addLast('foo');
      deque.addLast('bar');
      expect(deque.size()).equal(2);
      expect(() => deque.addLast('foobar')).to.throw(OverflowException);
      expect(deque.removeFirst()).equal('foo');
      expect(deque.removeFirst()).equal('bar');
      expect(deque.pollFirst()).to.be.undefined;
      expect(deque.isEmpty()).to.be.true;
      expect(() => deque.removeFirst()).to.throw(UnderflowException);
    });
  });

  describe('LIFO', () => {
    it('can be used as a Stack with addLast/removeLast', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      deque.addLast('foo');
      deque.addLast('bar');
      expect(deque.size()).equal(2);
      expect(() => deque.addLast('foobar')).to.throw(OverflowException);
      expect(deque.removeLast()).equal('bar');
      expect(deque.removeLast()).equal('foo');
      expect(deque.pollLast()).to.be.undefined;
      expect(() => deque.removeLast()).to.throw(UnderflowException);
    });
    it('can be used as a Stack with addFirst/removeFirst', () => {
      const deque = new ArrayDeque({ capacity: 2 });
      deque.addFirst('foo');
      deque.addFirst('bar');
      expect(deque.size()).equal(2);
      expect(() => deque.addFirst('foobar')).to.throw(OverflowException);
      expect(deque.removeFirst()).equal('bar');
      expect(deque.removeFirst()).equal('foo');
      expect(deque.pollFirst()).to.be.undefined;
      expect(() => deque.removeFirst()).to.throw(UnderflowException);
    });
  });

  describe('offerFirst', () => {
    it('should add item on an empty list', () => {
      const deque = new ArrayDeque();
      expect(deque.offerFirst('foo')).equal(true);
      expect(deque.size()).equal(1);
      expect(deque.peekFirst()).equal('foo');
      expect(deque.peekLast()).equal('foo');
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const deque = new ArrayDeque({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
      expect(deque.size()).to.equal(2);
      expect(deque.remaining()).to.equal(1);
      deque.clear();
      expect(deque.size()).to.equal(0);
      expect(deque.remaining()).to.equal(3);
      expect(deque.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty deque', () => {
      const deque = new ArrayDeque();
      expect(deque.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty deque', () => {
      const deque = new ArrayDeque();
      expect(deque.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.find(x => x >= 5)).equal(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty deque', () => {
      const deque = new ArrayDeque();
      expect(deque.removeItem(1)).to.be.false;
      expect(deque.isEmpty()).to.be.true;
      expect(deque.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const deque = new ArrayDeque({ initial: arr });
      expect(deque.removeItem(4)).to.be.false;
      expect(deque.isEmpty()).to.be.false;
      expect(deque.size()).equal(3);
    });
    it('should remove first occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const deque = new ArrayDeque({ initial: arr });
      expect(deque.removeItem(0)).to.be.true;
      expect(deque.isEmpty()).to.be.false;
      expect(deque.size()).equal(4);
      expect(deque.toArray()).deep.equal([1, 2, 0, 3]);
    });
  });

  describe('filter', () => {
    it('should return false on empty deque', () => {
      const deque = new ArrayDeque();
      expect(deque.filter(i => i === 0)).to.be.false;
      expect(deque.isEmpty()).to.be.true;
      expect(deque.size()).equal(0);
    });

    it('should return false if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const deque = new ArrayDeque({ initial: arr });
      expect(deque.filter(i => i > 0)).to.be.false;
      expect(deque.isEmpty()).to.be.false;
      expect(deque.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const deque = new ArrayDeque({ initial: arr });
      expect(deque.filter(i => i > 0)).to.be.true;
      expect(deque.isEmpty()).to.be.false;
      expect(deque.size()).equal(3);
      expect(deque.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('grow deque as necessary', () => {
    it('with add/remove', () => {
      const deque = new ArrayDeque();
      for (let i = 0; i < 8; ++i) deque.add(i);
      for (let i = 0; i < 4; ++i) {
        expect(deque.remove()).equal(i);
      }
      for (let i = 8; i < 50; ++i) deque.add(i);
      for (let i = 4; i < 50; ++i) {
        expect(deque.remove()).equals(i);
      }
      expect(deque.isEmpty()).to.be.true;
    });
    it('with addLast/removeFirst', () => {
      const deque = new ArrayDeque();
      for (let i = 0; i < 8; ++i) deque.addLast(i);
      for (let i = 0; i < 4; ++i) {
        expect(deque.removeFirst()).equal(i);
      }
      for (let i = 8; i < 50; ++i) deque.addLast(i);
      for (let i = 4; i < 50; ++i) {
        expect(deque.removeFirst()).equals(i);
      }
      expect(deque.isEmpty()).to.be.true;
    });

    it('with addFirst/removeLast', () => {
      const deque = new ArrayDeque();
      for (let i = 0; i < 8; ++i) deque.addFirst(i);
      for (let i = 0; i < 4; ++i) {
        expect(deque.removeLast()).equal(i);
      }
      for (let i = 8; i < 50; ++i) deque.addFirst(i);
      for (let i = 4; i < 50; ++i) {
        expect(deque.removeLast()).equals(i);
      }
      expect(deque.isEmpty()).to.be.true;
    });
  });

  describe('all', () => {
    it('should return true on empty', () => {
      const deque = new ArrayDeque();
      expect(deque.all(_ => false)).to.be.true;
    });
    it('should return true if predicate is true for all elements', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.all(x => x >= 0)).to.be.true;
    });
    it('should return false if predicate is false for at least one element', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.all(x => x < 9)).to.be.false;
    });
  });

  describe('some', () => {
    it('should return false on empty', () => {
      const deque = new ArrayDeque();
      expect(deque.some(_ => true)).to.be.false;
    });
    it('should return true if predicate is true for at least one element', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.some(x => x === 9)).to.be.true;
    });
    it('should return false if predicate is false for all elements', () => {
      const deque = new ArrayDeque({ initial: { length: 10, seed: (i: number) => i } });
      expect(deque.some(x => x > 9)).to.be.false;
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const deque = new ArrayDeque(2);
      const data = [1, 2, 3];
      expect(deque.offerFully(data)).equal(0);
      expect(deque.isEmpty()).to.be.true;
      expect(deque.offerFully(new ArrayDeque({ initial: data }))).equal(0);
      expect(deque.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const deque = new ArrayDeque(6);
      const data = [1, 2, 3];
      expect(deque.offerFully(data)).equal(3);
      expect(deque.size()).equal(3);
      expect(deque.offerFully(new ArrayDeque({ initial: data }))).equal(3);
      expect(deque.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const deque = new ArrayDeque(2);
      const data = [1, 2, 3];
      expect(deque.offerPartially(data)).equal(2);
      expect(deque.toArray()).to.deep.equal([1, 2]);
      deque.clear();
      expect(deque.offerPartially(new ArrayDeque({ initial: data }))).equal(2);
      expect(deque.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const deque = new ArrayDeque(6);
      const data = [1, 2, 3];
      expect(deque.offerPartially(data)).equal(3);
      expect(deque.size()).equal(3);
      expect(deque.offerPartially(new ArrayDeque({ initial: data }))).equal(3);
      expect(deque.size()).equal(6);
    });
  });
});
