import { expect } from 'chai';
import { ArrayMultiSet, MutableMultiSet } from '../../src';
import { ImmutableMultiSet } from '../../src/immutables/immutableMultiSet';

describe('ImmutableMultiSet', () => {
  let multiSet: MutableMultiSet<number>;
  let immutableMultiSet: ImmutableMultiSet<number>;

  beforeEach(() => {
    // Create an actual MultiSet and wrap it in an ImmutableMultiSet
    multiSet = new ArrayMultiSet<number>();
    multiSet.setCount(42, 2); // 42 appears twice
    multiSet.setCount(99, 1); // 99 appears once
    immutableMultiSet = new ImmutableMultiSet(multiSet);
  });

  // Tests for ImmutableCollection functionality
  describe('ImmutableCollection functionality', () => {
    describe('size', () => {
      it('should return the combined count of all elements in the MultiSet', () => {
        expect(immutableMultiSet.size()).to.equal(3);
        expect(immutableMultiSet.capacity()).to.equal(3);
        expect(immutableMultiSet.isFull()).to.be.true;
        expect(immutableMultiSet.remaining()).to.equal(0);
        expect(immutableMultiSet.isEmpty()).to.be.false;
      });
    });

    describe('isEmpty', () => {
      it('should return false if the MultiSet contains elements', () => {
        expect(immutableMultiSet.isEmpty()).to.be.false;
      });

      it('should return true if the MultiSet is empty', () => {
        const emptyImmutableMultiSet = new ImmutableMultiSet(new ArrayMultiSet<number>());
        expect(emptyImmutableMultiSet.isEmpty()).to.be.true;
      });
    });

    describe('contains', () => {
      it('should return true if the MultiSet contains the item', () => {
        expect(immutableMultiSet.contains(42)).to.be.true;
        expect(immutableMultiSet.contains(99)).to.be.true;
      });

      it('should return false if the MultiSet does not contain the item', () => {
        expect(immutableMultiSet.contains(7)).to.be.false;
      });
    });

    describe('includes', () => {
      it('should return true if the MultiSet includes the item', () => {
        expect(immutableMultiSet.includes(42)).to.be.true;
        expect(immutableMultiSet.includes(99)).to.be.true;
      });

      it('should return false if the MultiSet does not include the item', () => {
        expect(immutableMultiSet.includes(7)).to.be.false;
      });
    });

    describe('find', () => {
      it('should return the item if the MultiSet includes the item', () => {
        expect(immutableMultiSet.find(x => x % 2 === 0)).equals(42);
        expect(immutableMultiSet.find(x => x % 2 === 1)).equals(99);
      });

      it('should return false if the MultiSet does not include the item', () => {
        expect(immutableMultiSet.find(x => x % 5 === 0)).to.be.undefined;
      });
    });

    describe('toArray', () => {
      it('should return an array with all elements, respecting their counts', () => {
        expect(immutableMultiSet.toArray()).to.eql([42, 42, 99]);
      });
    });

    describe('equals', () => {
      it('should return true for another MultiSet with the same elements and counts', () => {
        const otherMultiSet = new ArrayMultiSet<number>();
        otherMultiSet.setCount(42, 2);
        otherMultiSet.setCount(99, 1);

        const otherImmutableMultiSet = new ImmutableMultiSet(otherMultiSet);
        expect(immutableMultiSet.equals(otherImmutableMultiSet)).to.be.true;
      });

      it('should return false for another MultiSet with different counts or elements', () => {
        const differentMultiSet = new ArrayMultiSet<number>();
        differentMultiSet.setCount(42, 1); // Different count
        differentMultiSet.setCount(99, 1);

        const otherImmutableMultiSet = new ImmutableMultiSet(differentMultiSet);
        expect(immutableMultiSet.equals(otherImmutableMultiSet)).to.be.false;
      });
    });
  });

  // Tests for ImmutableMultiSet functionality
  describe('ImmutableMultiSet specific functionality', () => {
    describe('count', () => {
      it('should return the count of an item in the MultiSet', () => {
        expect(immutableMultiSet.count(42)).to.equal(2);
        expect(immutableMultiSet.count(99)).to.equal(1);
      });

      it('should return 0 for an item not in the MultiSet', () => {
        expect(immutableMultiSet.count(7)).to.equal(0);
      });
    });

    describe('entries', () => {
      it('should return entries (key and count pairs) in the MultiSet', () => {
        const expectedEntries = [
          { key: 42, count: 2 },
          { key: 99, count: 1 },
        ];
        expect(Array.from(immutableMultiSet.entries())).to.eql(expectedEntries);
      });
    });

    describe('entryIterator', () => {
      it('should return an iterator over the entries in the MultiSet', () => {
        const expectedEntries = [
          { key: 42, count: 2 },
          { key: 99, count: 1 },
        ];
        const result = Array.from(immutableMultiSet.entryIterator());
        expect(result).to.eql(expectedEntries);
      });
    });

    describe('keys', () => {
      it('should return an iterator over unique keys in the MultiSet', () => {
        expect([...immutableMultiSet.keys()]).to.eql([42, 99]);
      });
    });

    describe('keyIterator', () => {
      it('should return a FluentIterator of unique keys in the MultiSet', () => {
        expect([...immutableMultiSet.keyIterator()]).to.eql([42, 99]);
      });
    });

    describe('nbKeys', () => {
      it('should return the number of unique keys in the MultiSet', () => {
        expect(immutableMultiSet.nbKeys()).to.equal(2);
      });

      it('should return 0 if the MultiSet is empty', () => {
        const emptyImmutableMultiSet = new ImmutableMultiSet(new ArrayMultiSet<number>());
        expect(emptyImmutableMultiSet.nbKeys()).to.equal(0);
      });
    });
  });
});
