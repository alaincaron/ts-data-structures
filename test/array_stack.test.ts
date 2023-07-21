import { OverflowException, UnderflowException, ArrayStack, ArrayDeque } from '../src';
import { expect } from 'chai';

describe('ArrayStack', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const stack = new ArrayStack();
      expect(stack.capacity()).equal(Infinity);
      expect(stack.size()).equal(0);
      expect(stack.remaining()).equal(Infinity);
      expect(stack.isEmpty()).to.be.true;
      expect(stack.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const stack = new ArrayStack(2);
      expect(stack.capacity()).equal(2);
      expect(stack.size()).equal(0);
      expect(stack.remaining()).equal(2);
      expect(stack.isEmpty()).to.be.true;
      expect(stack.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const stack = new ArrayStack({ capacity: 2 });
      expect(stack.capacity()).equal(2);
      expect(stack.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument in revers order', () => {
      const arr = [1, 2];
      const stack = new ArrayStack({ capacity: 2, initial: arr });
      expect(stack.capacity()).equal(2);
      expect(stack.size()).equal(2);
      expect(stack.remaining()).equal(0);
      expect(stack.isEmpty()).to.be.false;
      expect(stack.isFull()).to.be.true;
      expect(stack.toArray()).to.deep.equal(arr.reverse());
    });

    it('should be identical to the ArrayStack argument', () => {
      const arr = [1, 2];
      const stack1 = new ArrayStack({ capacity: 3, initial: arr });
      expect(stack1.capacity()).equal(3);
      const stack2 = new ArrayStack(stack1);
      expect(stack2).to.deep.equal(stack1);
      expect(stack2.capacity()).equal(3);
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const deque = new ArrayDeque({ initial: arr });
      const stack = new ArrayStack({ initial: deque });
      expect(stack.capacity()).equal(Infinity);
      expect(stack.toArray()).deep.equal(arr.reverse());
    });

    it('should use the ArrayLike argument', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const stack = new ArrayStack({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(stack.toArray()).to.deep.equal(arr.reverse());
    });

    it('should expand capacity to match number of initial elements', () => {
      const stack = new ArrayStack({ capacity: 0, initial: { length: 10, seed: i => i + 1 } });
      expect(stack.capacity()).equal(10);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new ArrayStack();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('LIFO', () => {
    it('respect LIFO semantics witt add', () => {
      const stack = new ArrayStack({ capacity: 2 });
      stack.add('foo');
      stack.add('bar');
      expect(stack.size()).equal(2);
      expect(() => stack.add('foobar')).to.throw(OverflowException);
      expect(stack.pop()).equal('bar');
      expect(stack.pop()).equal('foo');
      expect(stack.poll()).to.be.undefined;
      expect(() => stack.pop()).to.throw(UnderflowException);
    });
    it('respect LIFO semantics witt push', () => {
      const stack = new ArrayStack(2);
      stack.push('foo');
      stack.push('bar');
      expect(stack.size()).equal(2);
      expect(() => stack.add('foobar')).to.throw(OverflowException);
      expect(stack.pop()).equal('bar');
      expect(stack.pop()).equal('foo');
      expect(stack.poll()).to.be.undefined;
      expect(() => stack.pop()).to.throw(UnderflowException);
    });
  });

  describe('tryPush', () => {
    it('returns false on full queue', () => {
      const stack = new ArrayStack(1);
      stack.push('a');
      expect(stack.tryPush('b')).to.be.false;
      expect(stack.peek()).equal('a');
    });
    it('returns true on non-full queue', () => {
      const stack = new ArrayStack(1);
      expect(stack.tryPush('a')).to.be.true;
      expect(stack.peek()).equal('a');
    });
  });

  describe('swap', () => {
    it('should throw if less than 2 elemeents', () => {
      const stack = new ArrayStack<number>({ initial: { length: 1, seed: i => i } });
      expect(() => stack.swap()).to.throw(UnderflowException);
      expect(stack.size()).equal(1);
      expect(stack.peek()).equal(0);
    });
    it('should swap top 2 elemeents', () => {
      const stack = new ArrayStack<number>({ initial: { length: 3, seed: i => i } });
      stack.swap();
      expect(stack.pop()).equal(1);
      expect(stack.pop()).equal(2);
      expect(stack.pop()).equal(0);
      expect(stack.isEmpty()).to.be.true;
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const stack = new ArrayStack({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
      expect(stack.size()).to.equal(2);
      expect(stack.remaining()).to.equal(1);
      stack.clear();
      expect(stack.size()).to.equal(0);
      expect(stack.remaining()).to.equal(3);
      expect(stack.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty stack', () => {
      const stack = new ArrayStack();
      expect(stack.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const stack = new ArrayStack({ initial: { length: 10, seed: (i: number) => i } });
      expect(stack.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const stack = new ArrayStack({ initial: { length: 10, seed: (i: number) => i } });
      expect(stack.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty stack', () => {
      const stack = new ArrayStack();
      expect(stack.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const stack = new ArrayStack({ initial: { length: 10, seed: (i: number) => i } });
      expect(stack.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const stack = new ArrayStack({ initial: { length: 10, seed: (i: number) => i } });
      expect(stack.find(x => x >= 5)).equal(9);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty stack', () => {
      const stack = new ArrayStack();
      expect(stack.removeItem(1)).to.be.false;
      expect(stack.isEmpty()).to.be.true;
      expect(stack.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const stack = new ArrayStack({ initial: arr });
      expect(stack.removeItem(4)).to.be.false;
      expect(stack.isEmpty()).to.be.false;
      expect(stack.size()).equal(3);
    });
    it('should remove last occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const stack = new ArrayStack({ initial: arr });
      expect(stack.removeItem(0)).to.be.true;
      expect(stack.isEmpty()).to.be.false;
      expect(stack.size()).equal(4);
      expect(stack.toArray()).deep.equal([3, 2, 0, 1]);
    });
  });

  describe('filter', () => {
    it('should return false on empty stack', () => {
      const stack = new ArrayStack();
      expect(stack.filter(i => i === 0)).to.be.false;
      expect(stack.isEmpty()).to.be.true;
      expect(stack.size()).equal(0);
    });

    it('should return false if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const stack = new ArrayStack({ initial: arr });
      expect(stack.filter(i => i > 0)).to.be.false;
      expect(stack.isEmpty()).to.be.false;
      expect(stack.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const stack = new ArrayStack({ initial: arr });
      expect(stack.filter(i => i > 0)).to.be.true;
      expect(stack.isEmpty()).to.be.false;
      expect(stack.size()).equal(3);
      expect(stack.toArray()).deep.equal([3, 2, 1]);
    });
  });
});
