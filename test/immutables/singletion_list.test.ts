import { expect } from 'chai';
import { IndexOutOfBoundsException, SingletonList } from '../../src';

describe('SingletonList', () => {
  let singletonList: SingletonList<number>;

  beforeEach(() => {
    singletonList = new SingletonList(42);
  });

  // Tests for SingletonCollection functionality
  describe('SingletonCollection functionality', () => {
    describe('size', () => {
      it('should always return 1', () => {
        expect(singletonList.size()).to.equal(1);
      });
    });

    describe('isEmpty', () => {
      it('should always return false', () => {
        expect(singletonList.isEmpty()).to.be.false;
      });
    });

    describe('contains', () => {
      it('should return true for the contained item', () => {
        expect(singletonList.contains(42)).to.be.true;
      });

      it('should return false for any other item', () => {
        expect(singletonList.contains(99)).to.be.false;
      });
    });

    describe('toArray', () => {
      it('should return the single item in an array', () => {
        expect(singletonList.toArray()).to.eql([42]);
      });
    });

    describe('equals', () => {
      it('should return true for another SingletonList with the same item', () => {
        const otherList = new SingletonList(42);
        expect(singletonList.equals(otherList)).to.be.true;
      });

      it('should return false for another SingletonList with a different item', () => {
        const otherList = new SingletonList(99);
        expect(singletonList.equals(otherList)).to.be.false;
      });

      it('should return false for non-list objects', () => {
        expect(singletonList.equals([42])).to.be.false;
      });
    });

    describe('first and last', () => {
      it('should return the stored item for first()', () => {
        expect(singletonList.first()).to.equal(42);
      });

      it('should return the stored item for last()', () => {
        expect(singletonList.last()).to.equal(42);
      });
    });
  });

  // Tests for SingletonList functionality
  describe('SingletonList specific functionality', () => {
    describe('getAt', () => {
      it('should return the item when the index is 0', () => {
        expect(singletonList.getAt(0)).to.equal(42);
      });

      it('should throw an error for any other index', () => {
        expect(() => singletonList.getAt(1)).to.throw(IndexOutOfBoundsException);
        expect(() => singletonList.getAt(-1)).to.throw(IndexOutOfBoundsException);
      });
    });

    describe('getFirst and getLast', () => {
      it('should return the stored item for getFirst()', () => {
        expect(singletonList.getFirst()).to.equal(42);
      });

      it('should return the stored item for getLast()', () => {
        expect(singletonList.getLast()).to.equal(42);
      });
    });

    describe('peekFirst and peekLast', () => {
      it('should return the stored item for peekFirst()', () => {
        expect(singletonList.peekFirst()).to.equal(42);
      });

      it('should return the stored item for peekLast()', () => {
        expect(singletonList.peekLast()).to.equal(42);
      });
    });

    describe('indexOf and lastIndexOf', () => {
      it('should return 0 for the stored item in indexOf()', () => {
        expect(singletonList.indexOf(42)).to.equal(0);
      });

      it('should return -1 for an item not in the list in indexOf()', () => {
        expect(singletonList.indexOf(99)).to.equal(-1);
      });

      it('should return 0 for the stored item in lastIndexOf()', () => {
        expect(singletonList.lastIndexOf(42)).to.equal(0);
      });

      it('should return -1 for an item not in the list in lastIndexOf()', () => {
        expect(singletonList.lastIndexOf(99)).to.equal(-1);
      });
    });

    describe('indexOfFirstOccurrence and indexOfLastOccurrence', () => {
      it('should return 0 if the predicate matches the stored item', () => {
        expect(singletonList.indexOfFirstOccurrence(item => item === 42)).to.equal(0);
      });

      it('should return -1 if the predicate does not match the stored item', () => {
        expect(singletonList.indexOfFirstOccurrence(item => item === 99)).to.equal(-1);
      });

      it('should return 0 if the predicate matches the stored item in indexOfLastOccurrence()', () => {
        expect(singletonList.indexOfLastOccurrence(item => item === 42)).to.equal(0);
      });

      it('should return -1 if the predicate does not match the stored item in indexOfLastOccurrence()', () => {
        expect(singletonList.indexOfLastOccurrence(item => item === 99)).to.equal(-1);
      });
    });

    describe('isOrdered and isStrictlyOrdered', () => {
      it('should return true for isOrdered()', () => {
        expect(singletonList.isOrdered()).to.be.true;
      });

      it('should return true for isStrictlyOrdered()', () => {
        expect(singletonList.isStrictlyOrdered()).to.be.true;
      });
    });

    describe('toArray with bounds', () => {
      it('should return an array with the single item if bounds are valid', () => {
        expect(singletonList.toArray(0, 1)).to.eql([42]);
      });

      it('should throw an error if bounds are invalid', () => {
        expect(() => singletonList.toArray(1, 2)).to.throw(IndexOutOfBoundsException);
        expect(() => singletonList.toArray(0, 2)).to.throw(IndexOutOfBoundsException);
      });
    });

    describe('listIterator and reverseListIterator', () => {
      it('should return a singleton iterator if bounds are valid in listIterator', () => {
        expect([...singletonList]).to.eql([42]);
        expect([...singletonList.listIterator(0, 1)]).to.eql([42]);
        expect([...singletonList.reverseListIterator(0, 1)]).to.eql([42]);
        expect([...singletonList.reverseIterator()]).to.eql([42]);
      });

      it('should return an empty iterator if bounds are invalid in listIterator', () => {
        expect(() => singletonList.listIterator(1, 2)).to.throw(IndexOutOfBoundsException);
      });

      it('should return an empty iterator if bounds are invalid in reverseListIterator', () => {
        expect(() => singletonList.reverseListIterator(1, 2)).to.throw(IndexOutOfBoundsException);
      });
    });
  });
});
