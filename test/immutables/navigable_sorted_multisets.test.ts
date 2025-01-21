import { expect } from 'chai';
import { ImmutableNavigableMultiSet } from '../../src/immutables/immutableNavigableMultiSet';
import { ImmutableSortedMultiSet } from '../../src/immutables/immutableSortedMultiSet';
import { AvlTreeMultiSet } from '../../src/multisets';

describe('Navigable and Sorted MultiSets', () => {
  describe('ImmutableSortedMultiSet', () => {
    let baseSet: AvlTreeMultiSet<number>;
    let immutableSet: ImmutableSortedMultiSet<number>;

    beforeEach(() => {
      baseSet = new AvlTreeMultiSet<number>();
      [1, 1, 3, 3, 3, 5, 7, 7, 9].forEach(n => baseSet.add(n));
      immutableSet = new ImmutableSortedMultiSet(baseSet);
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
      expect(values).to.deep.equal([9, 7, 7, 5, 3, 3, 3, 1, 1]);

      baseSet.add(10);
      const updatedValues = Array.from(immutableSet.reverseIterator());
      expect(updatedValues).to.deep.equal([10, 9, 7, 7, 5, 3, 3, 3, 1, 1]);
    });

    it('should return same instance on clone', () => {
      const cloned = immutableSet.clone();
      expect(cloned).to.equal(immutableSet);
    });

    it('should reflect changes in underlying set', () => {
      baseSet.add(2);
      expect(Array.from(immutableSet)).to.deep.equal([1, 1, 2, 3, 3, 3, 5, 7, 7, 9]);

      baseSet.removeItem(3);
      expect(Array.from(immutableSet)).to.deep.equal([1, 1, 2, 3, 3, 5, 7, 7, 9]);
    });

    it('should provide accurate count of elements', () => {
      expect(immutableSet.count(1)).to.equal(2);
      expect(immutableSet.count(3)).to.equal(3);
      expect(immutableSet.count(7)).to.equal(2);
      expect(immutableSet.count(10)).to.equal(0);

      baseSet.add(1);
      expect(immutableSet.count(1)).to.equal(3);
    });

    it('should handle empty set operations', () => {
      const emptyBase = new AvlTreeMultiSet<number>();
      const emptyImmutable = new ImmutableSortedMultiSet(emptyBase);

      expect(emptyImmutable.first()).to.be.undefined;
      expect(emptyImmutable.last()).to.be.undefined;
      expect(Array.from(emptyImmutable.reverseIterator())).to.deep.equal([]);
      expect(emptyImmutable.count(1)).to.equal(0);
    });

    it('should maintain sorted order with duplicates when base set changes', () => {
      [8, 8, 2, 2, 4, 4, 6, 6].forEach(n => baseSet.add(n));
      expect(Array.from(immutableSet)).to.deep.equal([1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9]);
    });
  });

  describe('ImmutableNavigableMultiSet', () => {
    let baseSet: AvlTreeMultiSet<number>;
    let immutableSet: ImmutableNavigableMultiSet<number>;

    beforeEach(() => {
      baseSet = new AvlTreeMultiSet<number>();
      [1, 1, 3, 3, 3, 5, 7, 7, 9].forEach(n => baseSet.add(n));
      immutableSet = new ImmutableNavigableMultiSet(baseSet);
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

    it('should handle boundary cases', () => {
      expect(immutableSet.floor(Number.NEGATIVE_INFINITY)).to.be.undefined;
      expect(immutableSet.ceiling(Number.NEGATIVE_INFINITY)).to.equal(1);
      expect(immutableSet.floor(Number.POSITIVE_INFINITY)).to.equal(9);
      expect(immutableSet.ceiling(Number.POSITIVE_INFINITY)).to.be.undefined;
    });

    it('should handle empty set operations', () => {
      const emptyBase = new AvlTreeMultiSet<number>();
      const emptyImmutable = new ImmutableNavigableMultiSet(emptyBase);

      expect(emptyImmutable.floor(5)).to.be.undefined;
      expect(emptyImmutable.ceiling(5)).to.be.undefined;
      expect(emptyImmutable.lower(5)).to.be.undefined;
      expect(emptyImmutable.higher(5)).to.be.undefined;
      expect(emptyImmutable.count(5)).to.equal(0);
    });

    it('should inherit sorted multiset functionality', () => {
      expect(immutableSet.first()).to.equal(1);
      expect(immutableSet.last()).to.equal(9);
      expect(Array.from(immutableSet.reverseIterator())).to.deep.equal([9, 7, 7, 5, 3, 3, 3, 1, 1]);
      expect(immutableSet.count(3)).to.equal(3);
    });

    it('should handle changes in base set with duplicates', () => {
      baseSet.add(2);
      baseSet.add(2);
      baseSet.add(4);
      baseSet.add(4);
      baseSet.add(6);
      baseSet.add(6);
      baseSet.add(8);
      baseSet.add(8);

      expect(immutableSet.lower(5)).to.equal(4);
      expect(immutableSet.floor(5)).to.equal(5);
      expect(immutableSet.ceiling(5)).to.equal(5);
      expect(immutableSet.higher(5)).to.equal(6);
      expect(immutableSet.count(4)).to.equal(2);
      expect(immutableSet.count(6)).to.equal(2);

      baseSet.removeItem(5);

      expect(immutableSet.lower(5)).to.equal(4);
      expect(immutableSet.floor(5)).to.equal(4);
      expect(immutableSet.ceiling(5)).to.equal(6);
      expect(immutableSet.higher(5)).to.equal(6);
    });

    it('should maintain counts when modifying base set', () => {
      expect(immutableSet.count(3)).to.equal(3);
      baseSet.add(3);
      expect(immutableSet.count(3)).to.equal(4);
      baseSet.removeItem(3);
      expect(immutableSet.count(3)).to.equal(3);
      baseSet.removeItem(3);
      expect(immutableSet.count(3)).to.equal(2);
    });
  });
});
