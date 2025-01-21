import { expect } from 'chai';
import { ImmutableNavigableSet } from '../../src/immutables/immutableNavigableSet';
import { ImmutableSortedSet } from '../../src/immutables/immutableSortedSet';
import { AvlTreeSet } from '../../src/sets';

describe('Navigable and Sorted Sets', () => {
  describe('ImmutableSortedSet', () => {
    let baseSet: AvlTreeSet<number>;
    let immutableSet: ImmutableSortedSet<number>;

    beforeEach(() => {
      baseSet = new AvlTreeSet<number>();
      [1, 3, 5, 7, 9].forEach(n => baseSet.add(n));
      immutableSet = new ImmutableSortedSet(baseSet);
    });

    it('should provide immutable view of first element', () => {
      expect(immutableSet.first()).to.equal(1);
      baseSet.add(0);
      expect(immutableSet.first()).to.equal(0);
    });

    it('should provide immutable view of last element', () => {
      expect(immutableSet.last()).to.equal(9);
      baseSet.add(10);
      expect(immutableSet.last()).to.equal(10);
    });

    it('should provide immutable reverse iterator', () => {
      const values = Array.from(immutableSet.reverseIterator());
      expect(values).to.deep.equal([9, 7, 5, 3, 1]);

      baseSet.add(10);
      const updatedValues = Array.from(immutableSet.reverseIterator());
      expect(updatedValues).to.deep.equal([10, 9, 7, 5, 3, 1]);
    });

    it('should return same instance on clone', () => {
      const cloned = immutableSet.clone();
      expect(cloned).to.equal(immutableSet);
    });

    it('should reflect changes in underlying set', () => {
      baseSet.add(2);
      expect(Array.from(immutableSet)).to.deep.equal([1, 2, 3, 5, 7, 9]);

      baseSet.removeItem(3);
      expect(Array.from(immutableSet)).to.deep.equal([1, 2, 5, 7, 9]);
    });
  });

  describe('ImmutableNavigableSet', () => {
    let baseSet: AvlTreeSet<number>;
    let immutableSet: ImmutableNavigableSet<number>;

    beforeEach(() => {
      baseSet = new AvlTreeSet<number>();
      [1, 3, 5, 7, 9].forEach(n => baseSet.add(n));
      immutableSet = new ImmutableNavigableSet(baseSet);
    });

    it('should find floor element', () => {
      expect(immutableSet.floor(6)).to.equal(5);
      expect(immutableSet.floor(5)).to.equal(5);
      expect(immutableSet.floor(0)).to.be.undefined;

      baseSet.add(4);
      expect(immutableSet.floor(6)).to.equal(5);
      expect(immutableSet.floor(4.5)).to.equal(4);
    });

    it('should find ceiling element', () => {
      expect(immutableSet.ceiling(6)).to.equal(7);
      expect(immutableSet.ceiling(7)).to.equal(7);
      expect(immutableSet.ceiling(10)).to.be.undefined;

      baseSet.add(6);
      expect(immutableSet.ceiling(5.5)).to.equal(6);
      expect(immutableSet.ceiling(6)).to.equal(6);
    });

    it('should find lower element', () => {
      expect(immutableSet.lower(5)).to.equal(3);
      expect(immutableSet.lower(6)).to.equal(5);
      expect(immutableSet.lower(1)).to.be.undefined;

      baseSet.add(4);
      expect(immutableSet.lower(5)).to.equal(4);
      expect(immutableSet.lower(4)).to.equal(3);
    });

    it('should find higher element', () => {
      expect(immutableSet.higher(5)).to.equal(7);
      expect(immutableSet.higher(6)).to.equal(7);
      expect(immutableSet.higher(9)).to.be.undefined;

      baseSet.add(6);
      expect(immutableSet.higher(5)).to.equal(6);
      expect(immutableSet.higher(6)).to.equal(7);
    });

    it('should convert to regular Set', () => {
      const regularSet = immutableSet.toSet();
      expect(regularSet).to.be.instanceOf(Set);
      expect(Array.from(regularSet)).to.deep.equal([1, 3, 5, 7, 9]);

      baseSet.add(2);
      const updatedSet = immutableSet.toSet();
      expect(Array.from(updatedSet)).to.deep.equal([1, 2, 3, 5, 7, 9]);
    });

    it('should inherit sorted set functionality', () => {
      expect(immutableSet.first()).to.equal(1);
      expect(immutableSet.last()).to.equal(9);
      expect(Array.from(immutableSet.reverseIterator())).to.deep.equal([9, 7, 5, 3, 1]);
    });
  });
});
