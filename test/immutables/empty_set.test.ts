import { expect } from 'chai';
import { EmptySet } from '../../src/immutables/emptySet';
import { NavigableSet } from '../../src/sets';
import { HashSet } from '../../src/sets/hash_set';

describe('EmptySet', () => {
  let emptySet: NavigableSet<number>;

  beforeEach(() => {
    emptySet = EmptySet.instance<number>();
  });

  describe('instance', () => {
    it('should always return the same instance', () => {
      const set1 = EmptySet.instance<number>();
      const set2 = EmptySet.instance<string>();
      expect(set1).to.equal(set2);
    });
  });

  describe('toSet', () => {
    it('should return an empty Set', () => {
      const set = emptySet.toSet();
      expect(set).to.be.instanceOf(Set);
      expect(set.size).to.equal(0);
    });
  });

  describe('equals', () => {
    it('should return true for same instance', () => {
      expect(emptySet.equals(emptySet)).to.be.true;
    });

    it('should return false for null/undefined', () => {
      expect(emptySet.equals(null)).to.be.false;
      expect(emptySet.equals(undefined)).to.be.false;
    });

    it('should return true for another empty set', () => {
      const otherEmptySet = new HashSet<number>();
      expect(emptySet.equals(otherEmptySet)).to.be.true;
    });

    it('should return false for non-empty set', () => {
      const nonEmptySet = new HashSet<number>().add(1);
      expect(emptySet.equals(nonEmptySet)).to.be.false;
    });
  });

  describe('iterators', () => {
    it('should return empty iterator', () => {
      expect(emptySet.iterator().next().done).to.be.true;
    });

    it('should return empty reverse iterator', () => {
      expect(emptySet.reverseIterator().next().done).to.be.true;
    });
  });

  describe('navigation methods', () => {
    it('should return undefined for first/last', () => {
      expect(emptySet.first()).to.be.undefined;
      expect(emptySet.last()).to.be.undefined;
    });

    it('should return undefined for floor/ceiling', () => {
      expect(emptySet.floor(1)).to.be.undefined;
      expect(emptySet.ceiling(1)).to.be.undefined;
    });

    it('should return undefined for lower/higher', () => {
      expect(emptySet.lower(1)).to.be.undefined;
      expect(emptySet.higher(1)).to.be.undefined;
    });
  });
});
