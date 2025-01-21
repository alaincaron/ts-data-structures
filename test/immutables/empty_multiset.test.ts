import { expect } from 'chai';
import { EmptyMultiSet } from '../../src/immutables/emptyMultiSet';
import { NavigableMultiSet } from '../../src/multisets';
import { HashMultiSet } from '../../src/multisets/hash_multiset';

describe('EmptyMultiSet', () => {
  let emptyMultiSet: NavigableMultiSet<number>;

  beforeEach(() => {
    emptyMultiSet = EmptyMultiSet.instance<number>();
  });

  describe('instance', () => {
    it('should always return the same instance', () => {
      const set1 = EmptyMultiSet.instance<number>();
      const set2 = EmptyMultiSet.instance<string>();
      expect(set1).to.equal(set2);
    });
  });

  describe('equals', () => {
    it('should return true for same instance', () => {
      expect(emptyMultiSet.equals(emptyMultiSet)).to.be.true;
    });

    it('should return false for null/undefined', () => {
      expect(emptyMultiSet.equals(null)).to.be.false;
      expect(emptyMultiSet.equals(undefined)).to.be.false;
    });

    it('should return true for another empty multiset', () => {
      const otherEmptySet = new HashMultiSet<number>();
      expect(emptyMultiSet.equals(otherEmptySet)).to.be.true;
    });

    it('should return false for non-empty multiset', () => {
      const nonEmptySet = new HashMultiSet<number>().add(1);
      expect(emptyMultiSet.equals(nonEmptySet)).to.be.false;
    });
  });

  describe('iterators', () => {
    it('should return empty iterator', () => {
      expect(emptyMultiSet.iterator().next().done).to.be.true;
    });

    it('should return empty reverse iterator', () => {
      expect(emptyMultiSet.reverseIterator().next().done).to.be.true;
    });

    it('should return empty entry iterator', () => {
      expect(emptyMultiSet.entryIterator().next().done).to.be.true;
    });

    it('should return empty key iterator', () => {
      expect(emptyMultiSet.keyIterator().next().done).to.be.true;
    });

    it('should return empty reverse entry iterator', () => {
      expect(emptyMultiSet.reverseEntryIterator().next().done).to.be.true;
    });

    it('should return empty entries generator', () => {
      expect(emptyMultiSet.entries().next().done).to.be.true;
    });

    it('should return empty keys generator', () => {
      expect(emptyMultiSet.keys().next().done).to.be.true;
    });
  });

  describe('count', () => {
    it('should return 0 for any element', () => {
      expect(emptyMultiSet.count(1)).to.equal(0);
    });
  });

  describe('nbKeys', () => {
    it('should return 0', () => {
      expect(emptyMultiSet.nbKeys()).to.equal(0);
    });
  });

  describe('first/last', () => {
    it('should return undefined for first', () => {
      expect(emptyMultiSet.first()).to.be.undefined;
    });

    it('should return undefined for last', () => {
      expect(emptyMultiSet.last()).to.be.undefined;
    });

    it('should return undefined for firstEntry', () => {
      expect(emptyMultiSet.firstEntry()).to.be.undefined;
    });

    it('should return undefined for lastEntry', () => {
      expect(emptyMultiSet.lastEntry()).to.be.undefined;
    });
  });

  describe('navigation methods', () => {
    it('should return undefined for lower/higher', () => {
      expect(emptyMultiSet.lower(1)).to.be.undefined;
      expect(emptyMultiSet.higher(1)).to.be.undefined;
    });

    it('should return undefined for lowerEntry/higherEntry', () => {
      expect(emptyMultiSet.lowerEntry(1)).to.be.undefined;
      expect(emptyMultiSet.higherEntry(1)).to.be.undefined;
    });

    it('should return undefined for floor/ceiling', () => {
      expect(emptyMultiSet.floor(1)).to.be.undefined;
      expect(emptyMultiSet.ceiling(1)).to.be.undefined;
    });

    it('should return undefined for floorEntry/ceilingEntry', () => {
      expect(emptyMultiSet.floorEntry(1)).to.be.undefined;
      expect(emptyMultiSet.ceilingEntry(1)).to.be.undefined;
    });
  });
});
