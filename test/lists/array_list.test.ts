import { expect } from 'chai';
import { Generators } from 'ts-fluent-iterators';
import { ArrayList, IndexOutOfBoundsException, OverflowException, UnderflowException } from '../../src';

describe('ArrayList', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const list = new ArrayList();
      expect(list.capacity()).equal(Infinity);
      expect(list.size()).equal(0);
      expect(list.remaining()).equal(Infinity);
      expect(list.isEmpty()).to.be.true;
      expect(list.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const list = new ArrayList(2);
      expect(list.capacity()).equal(2);
      expect(list.size()).equal(0);
      expect(list.remaining()).equal(2);
      expect(list.isEmpty()).to.be.true;
      expect(list.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const list = ArrayList.create({ capacity: 2 });
      expect(list.capacity()).equal(2);
      expect(list.isEmpty()).to.be.true;
    });

    it('should have the same elements as the array argument', () => {
      const arr = [1, 2];
      const list = ArrayList.create({ capacity: 2, initial: arr });
      expect(list.capacity()).equal(2);
      expect(list.size()).equal(2);
      expect(list.remaining()).equal(0);
      expect(list.isEmpty()).to.be.false;
      expect(list.isFull()).to.be.true;
      expect(list.toArray()).to.deep.equal(arr);
    });

    it('should be identical to the ArrayList argument', () => {
      const arr = [1, 2];
      const list1 = ArrayList.create({ capacity: 3, initial: arr });
      expect(list1.capacity()).equal(3);
      const list2 = ArrayList.create({ initial: list1 });
      expect(list2).to.deep.equal(list1);
      expect(list2.capacity()).equal(3);
    });

    it('should be identical to the Collection argument', () => {
      const arr = [1, 2];
      const list1 = ArrayList.create({ initial: arr });
      const list2 = ArrayList.create({ initial: list1 });
      expect(list2.capacity()).equal(Infinity);
      expect(list2.toArray()).to.deep.equal(arr);
    });

    it('should use the function provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i + 1);
      const list = ArrayList.create({ initial: { length: arr.length, seed: i => i + 1 } });
      expect(list.toArray()).to.deep.equal(arr);
    });

    it('should use the iterator provided in the ArrayGenerator', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: Generators.range() } });
      expect(list.size()).equal(10);
      expect(list.toArray()).to.deep.equal(Array.from({ length: 10 }, (_, i) => i));
    });

    it('should use the iterable provided in the ArrayGenerator', () => {
      const arr = Array.from({ length: 2 }, (_, i) => i);
      const list = ArrayList.create({ initial: { length: 10, seed: arr } });
      expect(list.size()).equal(2);
      expect(list.toArray()).to.deep.equal(arr);
    });

    it('should throw if number of initial elements exceed capacity', () => {
      expect(() => ArrayList.create({ capacity: 0, initial: { length: 10, seed: i => i + 1 } })).to.throw(
        OverflowException
      );
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new ArrayList();
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.add('foo');
      expect(b.size()).equal(1);
      expect(a.size()).equal(0);
    });
  });

  describe('FIFO', () => {
    it('should behave as a FIFO', () => {
      const list = new ArrayList({ capacity: 2 });
      list.add('foo');
      list.add('bar');
      expect(list.size()).equal(2);
      expect(() => list.add('foobar')).to.throw(OverflowException);
      expect(list.removeFirst()).equal('foo');
      expect(list.removeFirst()).equal('bar');
      expect(list.isEmpty()).to.be.true;
      expect(() => list.removeFirst()).to.throw(UnderflowException);
    });
    it('should behave as a FIFO with addFirst/removeLast', () => {
      const list = new ArrayList({ capacity: 2 });
      list.addFirst('foo');
      list.addFirst('bar');
      expect(list.size()).equal(2);
      expect(() => list.addFirst('foobar')).to.throw(OverflowException);
      expect(list.removeLast()).equal('foo');
      expect(list.removeLast()).equal('bar');
      expect(list.isEmpty()).to.be.true;
      expect(() => list.removeLast()).to.throw(UnderflowException);
    });
    it('should behave as a FIFO with addLast/removeFirst', () => {
      const list = new ArrayList({ capacity: 2 });
      list.addLast('foo');
      list.addLast('bar');
      expect(list.size()).equal(2);
      expect(() => list.addLast('foobar')).to.throw(OverflowException);
      expect(list.removeFirst()).equal('foo');
      expect(list.removeFirst()).equal('bar');
      expect(list.isEmpty()).to.be.true;
      expect(() => list.removeFirst()).to.throw(UnderflowException);
    });
  });

  describe('LIFO', () => {
    it('can be used as a Stack with addLast/removeLast', () => {
      const list = new ArrayList({ capacity: 2 });
      list.addLast('foo');
      list.addLast('bar');
      expect(list.size()).equal(2);
      expect(() => list.addLast('foobar')).to.throw(OverflowException);
      expect(list.removeLast()).equal('bar');
      expect(list.removeLast()).equal('foo');
      expect(() => list.removeLast()).to.throw(UnderflowException);
    });
    it('can be used as a Stack with addFirst/removeFirst', () => {
      const list = new ArrayList({ capacity: 2 });
      list.addFirst('foo');
      list.addFirst('bar');
      expect(list.size()).equal(2);
      expect(() => list.addFirst('foobar')).to.throw(OverflowException);
      expect(list.removeFirst()).equal('bar');
      expect(list.removeFirst()).equal('foo');
      expect(() => list.removeFirst()).to.throw(UnderflowException);
    });
  });

  describe('getAt', () => {
    it('should throw IndexOutOfBoundException', () => {
      const list = new ArrayList();
      expect(() => list.getAt(-1)).to.throw(IndexOutOfBoundsException);
      expect(() => list.getAt(0)).to.throw(IndexOutOfBoundsException);
      expect(() => list.getAt(1)).to.throw(IndexOutOfBoundsException);
      list.add(12);
      expect(() => list.getAt(1)).to.throw(IndexOutOfBoundsException);
    });

    it('should return the value at the sepcified index', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(list.getAt(0)).equal(1);
      expect(list.getAt(1)).equal(2);
      expect(list.getAt(2)).equal(3);
    });
  });

  describe('addAt', () => {
    it('should insert the beginning of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      list.addAt(0, 4);
      expect(list.toArray()).deep.equal([4, 1, 2, 3]);
    });
    it('should insert in the middle of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      list.addAt(2, 4);
      expect(list.toArray()).deep.equal([1, 2, 4, 3]);
    });
    it('should insert at the end of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      list.addAt(3, 4);
      expect(list.toArray()).deep.equal([1, 2, 3, 4]);
    });
    it('should throw if index is out of bounds', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(() => list.addAt(-1, 0)).to.throw(IndexOutOfBoundsException);
      expect(() => list.addAt(4, 0)).to.throw(IndexOutOfBoundsException);
    });
  });

  describe('setAt', () => {
    it('should set at the beginning of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(list.setAt(0, 4)).equal(1);
      expect(list.toArray()).deep.equal([4, 2, 3]);
    });
    it('should set at in the middle of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(list.setAt(1, 4)).equal(2);
      expect(list.toArray()).deep.equal([1, 4, 3]);
    });
    it('should set at the end of a list', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(list.setAt(2, 4)).equal(3);
      expect(list.toArray()).deep.equal([1, 2, 4]);
    });
    it('should throw if index is out of bounds', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(() => list.setAt(-1, 0)).to.throw(IndexOutOfBoundsException);
      expect(() => list.setAt(4, 0)).to.throw(IndexOutOfBoundsException);
    });
  });

  describe('offerFirst', () => {
    it('should add item on an empty list', () => {
      const list = new ArrayList();
      expect(list.offerFirst('foo')).equal(true);
      expect(list.size()).equal(1);
      expect(list.getFirst()).equal('foo');
      expect(list.getLast()).equal('foo');
    });
    it('should return false if capacity is reached', () => {
      const list = new ArrayList(1);
      expect(list.offerFirst('foo')).equal(true);
      expect(list.isFull()).equal(true);
      expect(list.offerFirst('bar')).equal(false);
      expect(list.size()).equal(1);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const list = ArrayList.create({ capacity: 3, initial: { length: 2, seed: (i: number) => i } });
      expect(list.size()).to.equal(2);
      expect(list.remaining()).to.equal(1);
      list.clear();
      expect(list.size()).to.equal(0);
      expect(list.remaining()).to.equal(3);
      expect(list.toArray()).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return false on empty list', () => {
      const list = new ArrayList();
      expect(list.contains('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.contains(10)).to.be.false;
    });
    it('should return true if present', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.contains(9)).to.be.true;
    });
  });

  describe('find', () => {
    it('should return undefined on empty list', () => {
      const list = new ArrayList();
      expect(list.find(x => x === 'foo')).to.be.undefined;
    });
    it('should return undefined if no match', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.find(x => x >= 10)).to.be.undefined;
    });
    it('should return the first item matching the predicate', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.find(x => x >= 5)).equal(5);
    });
  });

  describe('removeItem', () => {
    it('should return false on empty list', () => {
      const list = new ArrayList();
      expect(list.removeItem(1)).to.be.false;
      expect(list.isEmpty()).to.be.true;
      expect(list.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const arr = [1, 2, 3];
      const list = ArrayList.create({ initial: arr });
      expect(list.removeItem(4)).to.be.false;
      expect(list.isEmpty()).to.be.false;
      expect(list.size()).equal(3);
    });
    it('should remove first occurence and return true if item is present', () => {
      const arr = [1, 0, 2, 0, 3];
      const list = ArrayList.create({ initial: arr });
      expect(list.removeItem(0)).to.be.true;
      expect(list.isEmpty()).to.be.false;
      expect(list.size()).equal(4);
      expect(list.toArray()).deep.equal([1, 2, 0, 3]);
    });
  });

  describe('filter', () => {
    it('should return 0 on empty list', () => {
      const list = new ArrayList();
      expect(list.filter(i => i === 0)).equal(0);
      expect(list.isEmpty()).to.be.true;
      expect(list.size()).equal(0);
    });

    it('should return 0 if all items match the predicate', () => {
      const arr = [1, 2, 3];
      const list = ArrayList.create({ initial: arr });
      expect(list.filter(i => i > 0)).equal(0);
      expect(list.isEmpty()).to.be.false;
      expect(list.size()).equal(3);
    });
    it('should remove all items not matching the filter', () => {
      const arr = [1, 0, 2, -1, 3];
      const list = ArrayList.create({ initial: arr });
      expect(list.filter(i => i > 0)).equal(2);
      expect(list.isEmpty()).to.be.false;
      expect(list.size()).equal(3);
      expect(list.toArray()).deep.equal([1, 2, 3]);
    });
  });

  describe('all', () => {
    it('should return true on empty', () => {
      const list = new ArrayList();
      expect(list.all(_ => false)).to.be.true;
    });
    it('should return true if predicate is true for all elements', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.all(x => x >= 0)).to.be.true;
    });
    it('should return false if predicate is false for at least one element', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.all(x => x < 9)).to.be.false;
    });
  });

  describe('some', () => {
    it('should return false on empty', () => {
      const list = new ArrayList();
      expect(list.some(_ => true)).to.be.false;
    });
    it('should return true if predicate is true for at least one element', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.some(x => x === 9)).to.be.true;
    });
    it('should return false if predicate is false for all elements', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: (i: number) => i } });
      expect(list.some(x => x > 9)).to.be.false;
    });
  });

  describe('offerFully', () => {
    it('should refuse all the items if not enough capacity remaining', () => {
      const list = new ArrayList(2);
      const data = [1, 2, 3];
      expect(list.offerFully(data)).equal(0);
      expect(list.isEmpty()).to.be.true;
      expect(list.offerFully(ArrayList.create({ initial: data }))).equal(0);
      expect(list.isEmpty()).to.be.true;
    });
    it('should accept all items if enough capacity remaining', () => {
      const list = new ArrayList(6);
      const data = [1, 2, 3];
      expect(list.offerFully(data)).equal(3);
      expect(list.size()).equal(3);
      expect(list.offerFully(ArrayList.create({ initial: data }))).equal(3);
      expect(list.size()).equal(6);
    });
  });

  describe('offerPartially', () => {
    it('should accept elements up to the remaining capacity', () => {
      const list = new ArrayList(2);
      const data = [1, 2, 3];
      expect(list.offerPartially(data)).equal(2);
      expect(list.toArray()).to.deep.equal([1, 2]);
      list.clear();
      expect(list.offerPartially(ArrayList.create({ initial: data }))).equal(2);
      expect(list.toArray()).to.deep.equal([1, 2]);
    });
    it('should accept all items if enough capacity remaining', () => {
      const list = new ArrayList(6);
      const data = [1, 2, 3];
      expect(list.offerPartially(data)).equal(3);
      expect(list.size()).equal(3);
      expect(list.offerPartially(ArrayList.create({ initial: data }))).equal(3);
      expect(list.size()).equal(6);
    });
  });

  describe('forEach', () => {
    it('should execute for each item', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      const x: number[] = [];
      list.forEach(e => x.push(e));
      expect(list.toArray()).to.deep.equal(x);
    });
    it('should do nothing if empty', () => {
      const list = new ArrayList();
      list.forEach(_ => {
        throw new Error('Should not be invoked');
      });
    });
  });

  describe('fold', () => {
    it('should compute the sum with an initial value', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      const sum = list.fold((a, b) => a + b, 1);
      expect(sum).equal(7);
    });
    it('should return initial value if empty', () => {
      const list = new ArrayList<number>();
      const sum = list.fold((a, b) => a + b, 1);
      expect(sum).equal(1);
    });
  });

  describe('reduce', () => {
    it('should compute the sum with an initial value', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      const sum = list.reduce((a, b) => a + b, 1);
      expect(sum).equal(7);
    });
    it('should compute the sum without an initial value', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      const sum = list.reduce((a, b) => a + b);
      expect(sum).equal(6);
    });
    it('should return undefined if empty and no initial value', () => {
      const list = new ArrayList<number>();
      const sum = list.reduce((a, b: number) => a + b);
      expect(sum).to.be.undefined;
    });
  });

  describe('replaceAll', () => {
    it('should double all elements', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      const transform = (x: number) => 2 * x;
      list.replaceAll(transform);
      expect(list.toArray()).to.deep.equal(data.map(transform));
    });
  });

  describe('indexOf', () => {
    it('should return -1 if the target is missing', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      expect(list.indexOf(4)).equal(-1);
    });

    it('should return the index of the first occurence', () => {
      const data = [0, 2, 1, 2, 3, 1, 0, 2];
      const list = ArrayList.create({ initial: data });
      expect(list.indexOf(1)).equal(2);
    });
  });

  describe('lastIndexOf', () => {
    it('should return -1 if the target is missing', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      expect(list.lastIndexOf(4)).equal(-1);
    });

    it('should return the index of the first occurence', () => {
      const data = [0, 2, 1, 2, 3, 1, 0, 2];
      const list = ArrayList.create({ initial: data });
      expect(list.lastIndexOf(1)).equal(list.size() - 3);
    });
  });

  describe('shuffle', () => {
    it('should not modify the list', () => {
      const data = [1, 2, 3];
      const list = ArrayList.create({ initial: data });
      list.shuffle(_x => 0);
      expect(list.toArray()).deep.equal(data);
    });
  });
  it('should send the first time at the end', () => {
    const data = [1, 2, 3];
    const list = ArrayList.create({ initial: data });
    list.shuffle(_x => 1);
    data.push(data.shift()!);
    expect(list.toArray()).deep.equal(data);
  });

  describe('sort', () => {
    it('should sort empty array', () => {
      const list = new ArrayList();
      list.sort();
      expect(list.size()).equal(0);
    });
    it('should sort according to the default comparator', () => {
      const list = ArrayList.create({ initial: { length: 10, seed: i => i } });
      const copy = list.clone();
      list.shuffle();
      list.sort();
      expect(list.toArray()).deep.equal(copy.toArray());
    });
    it('should sort according to the length of the strings', () => {
      const data = ['foobar', 'foo', 'bar', 'ba', 'a'];
      const list = ArrayList.create({ initial: data });
      const comparator = (s1: string, s2: string) => s1.length - s2.length;
      list.sort(comparator);
      expect(list.toArray()).deep.equal(data.sort(comparator));
    });
  });

  describe('reverse', () => {
    it('should left unmodified list with less than 2 elements', () => {
      const list = new ArrayList();
      list.reverse();
      expect(list.isEmpty()).to.be.true;
      list.add(1);
      list.reverse();
      expect(list.toArray()).deep.equal([1]);
    });

    it('should reverse list with odd number of elements', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      list.reverse();
      expect(list.toArray()).deep.equal([3, 2, 1]);
      expect(list.size()).equal(3);
    });
    it('should reverse list with even number of elements', () => {
      const list = ArrayList.create({ initial: [1, 2, 3, 4] });
      list.reverse();
      expect(list.toArray()).deep.equal([4, 3, 2, 1]);
      expect(list.size()).equal(4);
    });
  });

  describe('toJson', () => {
    it('should return the JSON string', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      expect(list.toJson()).equal('[1,2,3]');
    });
  });
});
