import { expect } from 'chai';
import { HashSet, Immutable, ImmutableSet, MutableSet } from '../../src';

describe('ImmutableSet', () => {
  let mutableSet: MutableSet<number>;
  let immutableSet: ImmutableSet<number>;

  beforeEach(() => {
    // Create a mutable set for delegation
    mutableSet = HashSet.create<number>({ initial: [1, 2, 3] });
    // Create an ImmutableSet based on the mutable set
    immutableSet = new ImmutableSet(mutableSet);
  });

  // Tests for ImmutableCollection functionality
  describe('ImmutableCollection functionality', () => {
    it('should return the size of the collection', () => {
      expect(immutableSet.size()).to.equal(3);
    });

    it('should verify the set is not empty', () => {
      expect(immutableSet.isEmpty()).to.be.false;
    });

    it('should confirm the element is contained in the collection', () => {
      expect(immutableSet.contains(2)).to.be.true;
    });

    it('should return false for elements not in the collection', () => {
      expect(immutableSet.contains(5)).to.be.false;
    });

    it('should create an array representation of the set elements', () => {
      expect(immutableSet.toArray()).to.eql([1, 2, 3]);
    });

    it('should create an iterator for the collection', () => {
      const iterator = immutableSet.iterator();
      expect(Array.from(iterator)).to.eql([1, 2, 3]);
    });

    describe('equals', () => {
      it('should return true when compared to another ISet with the same values', () => {
        expect(immutableSet.equals(HashSet.create({ initial: mutableSet }))).to.be.true;
      });

      it('should return false when compared to another ISet with different values', () => {
        expect(immutableSet.equals(Immutable.emptySet())).to.be.false;
      });

      it('should return false for non-collection types', () => {
        expect(immutableSet.equals('not a collection')).to.be.false;
      });
    });
  });

  // Tests for ImmutableSet-specific functionality
  describe('ImmutableSet functionality', () => {
    it('should convert to a native JavaScript Set', () => {
      const nativeSet = immutableSet.toSet();
      expect(nativeSet).to.be.instanceOf(Set);
      expect(Array.from(nativeSet)).to.eql([1, 2, 3]);
    });

    it('should allow immutability by not modifying the original set', () => {
      const nativeSet = immutableSet.toSet();
      nativeSet.add(4); // Modify the native set
      expect(Array.from(immutableSet.toSet())).to.eql([1, 2, 3]); // ImmutableSet should remain unchanged
    });

    it('should delegate to the underlying mutable set correctly', () => {
      expect(mutableSet.contains(2)).to.be.true;
      expect(immutableSet.contains(2)).to.be.true;

      mutableSet.add(4); // Modify the original set
      expect(immutableSet.contains(4)).to.be.true; // Reflects changes in the underlying delegation
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should handle empty sets properly', () => {
      const emptySet = new ImmutableSet(Immutable.emptySet<number>());
      expect(emptySet.size()).to.equal(0);
      expect(emptySet.isEmpty()).to.be.true;
      expect(emptySet.contains(1)).to.be.false;
      expect(emptySet.toArray()).to.eql([]);
    });

    it('should handle underlying mutable set being mutated after construction', () => {
      mutableSet.clear();
      expect(immutableSet.isEmpty()).to.be.true;
      expect(immutableSet.size()).to.equal(0);
    });

    it('should never allow changes to the immutable representation of the set', () => {
      const nativeSet = immutableSet.toSet();
      nativeSet.delete(1);
      expect(immutableSet.contains(1)).to.be.true; // ImmutableSet still contains the element
      expect(immutableSet.size()).to.equal(3); // Size remains unchanged
    });
  });
});
