import { expect } from 'chai';
import { ArrayList, ImmutableList, IndexOutOfBoundsException, MutableList } from '../../src';

describe('ImmutableList', () => {
  let immutableList: ImmutableList<number>;
  let delegate: MutableList<number>;

  beforeEach(() => {
    delegate = ArrayList.create({ initial: [10, 20, 30] });
    immutableList = new ImmutableList(delegate);
  });

  it('should return the correct first and last elements', () => {
    expect(immutableList.getFirst()).to.equal(10);
    expect(immutableList.getLast()).to.equal(30);
  });

  it('should retrieve elements based on index', () => {
    expect(immutableList.getAt(0)).to.equal(10);
    expect(immutableList.getAt(1)).to.equal(20);
    expect(immutableList.getAt(2)).to.equal(30);
  });

  it('should return correct index of a specific element', () => {
    expect(immutableList.indexOf(20)).to.equal(1);
    expect(immutableList.lastIndexOf(20)).to.equal(1);
  });

  it('should correctly identify if the list is ordered', () => {
    expect(immutableList.isOrdered()).to.be.true;
    expect(immutableList.isStrictlyOrdered()).to.be.true;
  });

  it('should iterate correctly with listIterator and reverseListIterator', () => {
    expect(immutableList.listIterator().collect()).to.eql([10, 20, 30]);
    expect(immutableList.reverseIterator().collect()).to.eql([30, 20, 10]);
    expect(immutableList.reverseListIterator().collect()).to.eql([30, 20, 10]);
  });

  it('should delegate order-related methods properly', () => {
    expect(immutableList.isOrdered()).to.be.true;
    expect(immutableList.isStrictlyOrdered()).to.be.true;
  });

  it('should throw for out-of-bounds indices', () => {
    expect(() => immutableList.getAt(5)).to.throw(IndexOutOfBoundsException);
  });

  it('should correctly delegate indexOfFirstOccurrence and indexOfLastOccurrence for predicates', () => {
    const predicate = (num: number) => num > 15;
    expect(immutableList.indexOfFirstOccurrence(predicate)).to.equal(1);
    expect(immutableList.indexOfLastOccurrence(predicate)).to.equal(2);
  });

  it('should peek at the first and last elements correctly', () => {
    expect(immutableList.peekFirst()).to.equal(10);
    expect(immutableList.peekLast()).to.equal(30);
  });

  describe('containsAll', () => {
    it('should return true if the argument is a subset, false otherwise', () => {
      expect(immutableList.containsAll([10])).to.be.true;
      expect(immutableList.containsAll([10, 20])).to.be.true;
      expect(immutableList.containsAll([10, 20, 42, 43])).to.be.false;
      expect(immutableList.containsAll([43])).to.be.false;
      expect(immutableList.containsAll([])).to.be.true;
    });
  });

  describe('disjoint', () => {
    it('should return true if the argument has no elements in common, false otherwise', () => {
      expect(immutableList.disjoint([10, 20])).to.be.false;
      expect(immutableList.disjoint([10, 10])).to.be.false;
      expect(immutableList.disjoint([42, 43])).to.be.true;
      expect(immutableList.disjoint([])).to.be.true;
    });
  });

  describe('iterator', () => {
    it('should return an iterator over the elements', () => {
      expect(immutableList.iterator().collect()).to.eql([10, 20, 30]);
    });
  });

  describe('hashCode', () => {
    it('should return the same hash code as the delegate', () => {
      expect(immutableList.hashCode()).to.equal(delegate.hashCode());
    });
  });

  describe('toJSON', () => {
    it('should return the same JSON representation as the delegate', () => {
      expect(immutableList.toJSON()).to.equal(delegate.toJSON());
    });
  });

  describe('asReadOnly', () => {
    it('should return itself', () => {
      expect(immutableList.asReadOnly()).to.equal(immutableList);
    });
  });

  describe('toReadOnly', () => {
    it('should return itself', () => {
      expect(immutableList.toReadOnly()).to.equal(immutableList);
    });
  });
});
