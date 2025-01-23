import { expect } from 'chai';
import { SingletonNavigableSet } from '../../src';

describe('SingletonNavigableSet', () => {
  let navigableSet: SingletonNavigableSet<number>;

  beforeEach(() => {
    navigableSet = new SingletonNavigableSet(42);
  });

  describe('size', () => {
    it('should always return 1', () => {
      expect(navigableSet.size()).to.equal(1);
    });
  });

  describe('isEmpty', () => {
    it('should always return false', () => {
      expect(navigableSet.isEmpty()).to.be.false;
    });
  });

  describe('contains', () => {
    it('should return true for the contained item', () => {
      expect(navigableSet.contains(42)).to.be.true;
    });

    it('should return false for any other item', () => {
      expect(navigableSet.contains(99)).to.be.false;
    });
  });

  describe('first and last', () => {
    it('should return the single item for first()', () => {
      expect(navigableSet.first()).to.equal(42);
    });

    it('should return the single item for last()', () => {
      expect(navigableSet.last()).to.equal(42);
    });
  });

  describe('lower, floor, ceiling, higher', () => {
    it('should return undefined for lower() since there is no smaller item', () => {
      expect(navigableSet.lower(42)).to.be.undefined;
    });

    it('should return the item itself for floor()', () => {
      expect(navigableSet.floor(42)).to.equal(42);
    });

    it('should return the item itself for ceiling()', () => {
      expect(navigableSet.ceiling(42)).to.equal(42);
    });

    it('should return undefined for higher() since there is no larger item', () => {
      expect(navigableSet.higher(42)).to.be.undefined;
    });
  });

  describe('toArray', () => {
    it('should return the item in an array', () => {
      expect(navigableSet.toArray()).to.eql([42]);
    });
  });

  describe('iterator', () => {
    it('should iterate over the single element', () => {
      expect([...navigableSet.iterator()]).to.eql([42]);
    });

    it('should support Symbol.iterator', () => {
      expect([...navigableSet]).to.eql([42]);
    });
  });

  describe('equals', () => {
    it('should return true for another SingletonNavigableSet with the same item', () => {
      const otherSet = new SingletonNavigableSet(42);
      expect(navigableSet.equals(otherSet)).to.be.true;
    });

    it('should return false for another SingletonNavigableSet with a different item', () => {
      const otherSet = new SingletonNavigableSet(99);
      expect(navigableSet.equals(otherSet)).to.be.false;
    });

    it('should return false for non-set objects', () => {
      expect(navigableSet.equals([42])).to.be.false;
    });
  });
});
