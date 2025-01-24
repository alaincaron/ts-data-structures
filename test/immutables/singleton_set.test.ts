import { expect } from 'chai';
import { hashAny, HashSet, SingletonSet } from '../../src';

describe('SingletonSet', () => {
  let singletonSet: SingletonSet<number>;

  beforeEach(() => {
    singletonSet = new SingletonSet<number>(42); // Single element in the set
  });

  // Tests for SingletonCollection functionality
  describe('SingletonCollection functionality', () => {
    describe('size', () => {
      it('should return 1 as the size of the singleton', () => {
        expect(singletonSet.size()).to.equal(1);
      });
    });

    describe('isEmpty', () => {
      it('should return false as the singleton set is never empty', () => {
        expect(singletonSet.isEmpty()).to.be.false;
      });
    });

    describe('contains', () => {
      it('should return true if the element matches the single item in the set', () => {
        expect(singletonSet.contains(42)).to.be.true;
      });

      it('should return false if the element does not match the single item in the set', () => {
        expect(singletonSet.contains(7)).to.be.false;
      });
    });

    describe('equals', () => {
      it('should return true if another set with the same value is compared', () => {
        const anotherSingletonSet = new SingletonSet<number>(42);
        expect(singletonSet.equals(anotherSingletonSet)).to.be.true;
      });

      it('should return false if another set with a different value is compared', () => {
        const anotherSingletonSet = new SingletonSet<number>(7);
        expect(singletonSet.equals(anotherSingletonSet)).to.be.false;
      });
    });

    describe('toArray', () => {
      it('should return an array with the single element', () => {
        expect(singletonSet.toArray()).to.eql([42]);
      });
    });
  });

  // Tests for SingletonSet-specific functionality
  describe('SingletonSet functionality', () => {
    describe('toSet', () => {
      it('should return a JavaScript Set containing the single element', () => {
        const set = singletonSet.toSet();
        expect(set).to.be.instanceOf(Set);
        expect(Array.from(set)).to.eql([42]);
      });
    });

    describe('first', () => {
      it('should return the single item as the first element', () => {
        expect(singletonSet.first()).to.equal(42);
      });
    });

    describe('last', () => {
      it('should return the single item as the last element', () => {
        expect(singletonSet.last()).to.equal(42);
      });
    });

    describe('reverseIterator', () => {
      it('should return an iterator with the single element in reverse order (same order for one element)', () => {
        const iterator = singletonSet.reverseIterator();
        expect(Array.from(iterator)).to.eql([42]);
      });
    });

    describe('clone', () => {
      it('should return itself', () => {
        expect(singletonSet.clone()).to.equal(singletonSet);
      });
    });

    describe('includes', () => {
      it('should return false if the argument is not the same as the single element', () => {
        expect(singletonSet.includes(7)).to.be.false;
      });
      it('should return true if the argument is the same as the single element', () => {
        expect(singletonSet.includes(42)).to.be.true;
      });
    });

    describe('toReadOnly', () => {
      it('should return itself', () => {
        expect(singletonSet.toReadOnly()).to.equal(singletonSet);
      });
    });

    describe('asReadOnly', () => {
      it('should return itself', () => {
        expect(singletonSet.asReadOnly()).to.equal(singletonSet);
      });
    });

    describe('hashCode', () => {
      it('should return the same hash code as the hash code of an array of the single element', () => {
        expect(singletonSet.hashCode()).to.equal(hashAny([42]));
      });
    });

    describe('equals', () => {
      it('should return true if compared to another SingletonSet with the same value', () => {
        const anotherSet = HashSet.create({ initial: [42] });
        expect(singletonSet.equals(anotherSet)).to.be.true;
      });

      it('should return true if compared to itself', () => {
        expect(singletonSet.equals(singletonSet)).to.be.true;
      });

      it('should return false if compared to another SingletonSet with a different value', () => {
        const anotherSet = new SingletonSet<number>(7);
        expect(singletonSet.equals(anotherSet)).to.be.false;
      });

      it('should return false if compared to a set with multiple elements', () => {
        const multiElementSet = HashSet.create({ initial: [42, 7] });
        expect(singletonSet.equals(multiElementSet)).to.be.false;
      });
    });
  });
});
