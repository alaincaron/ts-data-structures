import { CircularBuffer, OverflowException, UnderflowException } from '../src';
import { expect } from 'chai';

function* generator(): IterableIterator<number> {
  let i = 0;
  for (;;) yield i++;
}

describe('CircularBuffer', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const buffer = new CircularBuffer();
      expect(buffer.overflowHandler()).equal('throw');
      expect(buffer.capacity()).equal(Infinity);
      expect(buffer.size()).equal(0);
      expect(buffer.remaining()).equal(Infinity);
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const buffer = new CircularBuffer(2);
      expect(buffer.overflowHandler()).equal('throw');
      expect(buffer.capacity()).equal(2);
      expect(buffer.size()).equal(0);
      expect(buffer.remaining()).equal(2);
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const buffer = new CircularBuffer({ capacity: 2, overflowHandler: 'overwrite' });
      expect(buffer.overflowHandler()).equal('overwrite');
      expect(buffer.capacity()).equal(2);
      expect(buffer.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2];
      const buffer = new CircularBuffer({ capacity: 2, initial: arr, overflowHandler: 'overwrite' });
      expect(buffer.overflowHandler()).equal('overwrite');
      expect(buffer.capacity()).equal(2);
      expect(buffer.size()).equal(2);
      expect(buffer.remaining()).equal(0);
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.isFull()).to.be.true;
      expect(buffer.toArray()).to.deep.equal(arr);
    });

    it('should be identical to the CircularBuffer argument', () => {
      const arr = [1, 2];
      const buffer1 = new CircularBuffer({ capacity: 3, initial: arr });
      expect(buffer1.capacity()).equal(3);
      const buffer2 = new CircularBuffer(buffer1);
      expect(buffer2).to.deep.equal(buffer1);
      expect(buffer2.capacity()).equal(3);
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const buffer1 = new CircularBuffer({ initial: arr, overflowHandler: 'throw' });
      const buffer2 = new CircularBuffer({ initial: buffer1, overflowHandler: 'overwrite' });
      expect(buffer1.overflowHandler()).equal('throw');
      expect(buffer2.overflowHandler()).equal('overwrite');
      expect(buffer2.capacity()).equal(Infinity);
      expect(buffer2.toArray()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayLike', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const buffer = new CircularBuffer({
        initial: { length: arr.length, seed: i => i + 1 },
        overflowHandler: 'overwrite',
      });
      expect(buffer.overflowHandler()).equal('overwrite');
      expect(buffer.toArray()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayLike', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: generator() } });
      expect(buffer.size()).equal(10);
      expect(buffer.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayLike', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const buffer = new CircularBuffer({ initial: { length: 10, seed: arr } });
      expect(buffer.size()).equal(2);
      expect(buffer.toArray()).to.deep.equal(arr);
    });

    it('should expand capacity to match number of initial elements', () => {
      const buffer = new CircularBuffer({ capacity: 0, initial: { length: 10, seed: i => i + 1 } });
      expect(buffer.capacity()).equal(10);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new CircularBuffer({ overflowHandler: 'overwrite' });
      const b = a.clone();
      expect(b).to.deep.equal(a);
      expect(b.overflowHandler()).equal('overwrite');
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('overflow handling', () => {
    it('should throw if overflow', () => {
      const buffer = new CircularBuffer({ capacity: 2, overflowHandler: 'throw' });
      expect(buffer.overflowHandler()).equal('throw');
      buffer.add('foo');
      buffer.add('bar');
      expect(buffer.size()).equal(2);
      expect(buffer.isFull()).to.be.true;
      expect(() => buffer.add('foobar')).to.throw(OverflowException);
      expect(buffer.remove()).equal('foo');
      expect(buffer.remove()).equal('bar');
      expect(buffer.poll()).to.be.undefined;
      expect(buffer.isEmpty()).to.be.true;
      expect(() => buffer.remove()).to.throw(UnderflowException);
    });
    it('should overwrite if overflow', () => {
      const buffer = new CircularBuffer({ capacity: 2, overflowHandler: 'overwrite' });
      buffer.add('foo');
      buffer.add('bar');
      expect(buffer.size()).equal(2);
      buffer.add('foobar');
      expect(buffer.size()).equal(2);
      expect(buffer.remove()).equal('bar');
      expect(buffer.remove()).equal('foobar');
      expect(buffer.poll()).to.be.undefined;
      expect(buffer.isEmpty()).to.be.true;
      expect(() => buffer.remove()).to.throw(UnderflowException);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const buffer = new CircularBuffer({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
      expect(buffer.size()).to.equal(2);
      expect(buffer.remaining()).to.equal(1);
      buffer.clear();
      expect(buffer.size()).to.equal(0);
      expect(buffer.remaining()).to.equal(3);
      expect(buffer.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty buffer', () => {
      const buffer = new CircularBuffer();
      expect(buffer.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty buffer', () => {
      const buffer = new CircularBuffer();
      expect(buffer.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.find(x => x >= 5)).equal(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty buffer', () => {
      const buffer = new CircularBuffer();
      expect(buffer.removeItem(1)).to.be.false;
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const buffer = new CircularBuffer({ initial: arr });
      expect(buffer.removeItem(4)).to.be.false;
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.size()).equal(3);
    });
    it('should remove first occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const buffer = new CircularBuffer({ initial: arr });
      expect(buffer.removeItem(0)).to.be.true;
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.size()).equal(4);
      expect(buffer.toArray()).deep.equal([1, 2, 0, 3]);
    });
  });

  describe('filter', () => {
    it('should return false on empty buffer', () => {
      const buffer = new CircularBuffer();
      expect(buffer.filter(i => i === 0)).to.be.false;
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.size()).equal(0);
    });

    it('should return false if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const buffer = new CircularBuffer({ initial: arr });
      expect(buffer.filter(i => i > 0)).to.be.false;
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const buffer = new CircularBuffer({ initial: arr });
      expect(buffer.filter(i => i > 0)).to.be.true;
      expect(buffer.isEmpty()).to.be.false;
      expect(buffer.size()).equal(3);
      expect(buffer.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('all', () => {
    it('should return true on empty', () => {
      const buffer = new CircularBuffer();
      expect(buffer.all(_ => false)).to.be.true;
    });
    it('should return true if predicate is true for all elements', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.all(x => x >= 0)).to.be.true;
    });
    it('should return false if predicate is false for at least one element', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.all(x => x < 9)).to.be.false;
    });
  });

  describe('some', () => {
    it('should return false on empty', () => {
      const buffer = new CircularBuffer();
      expect(buffer.some(_ => true)).to.be.false;
    });
    it('should return true if predicate is true for at least one element', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.some(x => x === 9)).to.be.true;
    });
    it('should return false if predicate is false for all elements', () => {
      const buffer = new CircularBuffer({ initial: { length: 10, seed: (i: number) => i } });
      expect(buffer.some(x => x > 9)).to.be.false;
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const buffer = new CircularBuffer(2);
      const data = [1, 2, 3];
      expect(buffer.offerFully(data)).equal(0);
      expect(buffer.isEmpty()).to.be.true;
      expect(buffer.offerFully(new CircularBuffer({ initial: data }))).equal(0);
      expect(buffer.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const buffer = new CircularBuffer(6);
      const data = [1, 2, 3];
      expect(buffer.offerFully(data)).equal(3);
      expect(buffer.size()).equal(3);
      expect(buffer.offerFully(new CircularBuffer({ initial: data }))).equal(3);
      expect(buffer.size()).equal(6);
    });
    it('should accept all the items if overflowHandler is overwrite even if not enough capacity', () => {
      const buffer = new CircularBuffer({ capacity: 2, overflowHandler: 'overwrite' });
      const data = [1, 2, 3];
      expect(buffer.offerFully(data)).equal(3);
      expect(buffer.size()).equal(2);
      expect(buffer.toArray()).to.deep.equal([2, 3]);
    });
    it('should accept all items if enough capacity remaining with overflowHandler set to overwrite', () => {
      const buffer = new CircularBuffer({ capacity: 6, overflowHandler: 'overwrite' });
      const data = [1, 2, 3];
      expect(buffer.offerFully(data)).equal(3);
      expect(buffer.size()).equal(3);
      expect(buffer.offerFully(new CircularBuffer({ initial: data }))).equal(3);
      expect(buffer.size()).equal(6);
      expect(buffer.toArray()).to.deep.equal([...data, ...data]);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const buffer = new CircularBuffer(2);
      const data = [1, 2, 3];
      expect(buffer.offerPartially(data)).equal(2);
      expect(buffer.toArray()).to.deep.equal([1, 2]);
      buffer.clear();
      expect(buffer.offerPartially(new CircularBuffer({ initial: data }))).equal(2);
      expect(buffer.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const buffer = new CircularBuffer(6);
      const data = [1, 2, 3];
      expect(buffer.offerPartially(data)).equal(3);
      expect(buffer.size()).equal(3);
      expect(buffer.offerPartially(new CircularBuffer({ initial: data }))).equal(3);
      expect(buffer.size()).equal(6);
    });
    it('should accept all elements and overwrite ', () => {
      const buffer = new CircularBuffer({ capacity: 2, overflowHandler: 'overwrite' });
      const data = [1, 2, 3];
      expect(buffer.offerPartially(data)).equal(3);
      expect(buffer.toArray()).to.deep.equal([2, 3]);
      buffer.clear();
      expect(buffer.offerPartially(new CircularBuffer({ initial: data }))).equal(3);
      expect(buffer.toArray()).to.deep.equal([2, 3]);
    });
    it('should accept all items', () => {
      const buffer = new CircularBuffer({ capacity: 6, overflowHandler: 'overwrite' });
      const data = [1, 2, 3];
      expect(buffer.offerPartially(data)).equal(3);
      expect(buffer.size()).equal(3);
      expect(buffer.offerPartially(new CircularBuffer({ initial: data }))).equal(3);
      expect(buffer.size()).equal(6);
    });
  });
});
