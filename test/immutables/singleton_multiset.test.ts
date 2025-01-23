import { expect } from 'chai';
import { SingletonMultiSet } from '../../src';

describe('SingletonMultiSet', () => {
  let multiSet: SingletonMultiSet<number>;

  beforeEach(() => {
    multiSet = new SingletonMultiSet(42);
  });

  describe('count', () => {
    it('should return 1 for the item that equals the stored item', () => {
      expect(multiSet.count(42)).to.equal(1);
    });

    it('should return 0 for an item that does not equal the stored item', () => {
      expect(multiSet.count(99)).to.equal(0);
    });
  });

  describe('keys', () => {
    it('should yield the single key', () => {
      const keys = Array.from(multiSet.keys());
      expect(keys).to.eql([42]);
    });
  });

  describe('nbKeys', () => {
    it('should return 1 since there is only one unique key', () => {
      expect(multiSet.nbKeys()).to.equal(1);
    });
  });

  describe('first and last', () => {
    it('should return the single item for first()', () => {
      expect(multiSet.first()).to.equal(42);
    });

    it('should return the single item for last()', () => {
      expect(multiSet.last()).to.equal(42);
    });
  });

  describe('firstEntry and lastEntry', () => {
    it('should return an entry with the key and count 1 for firstEntry()', () => {
      expect(multiSet.firstEntry()).to.eql({ key: 42, count: 1 });
    });

    it('should return the same entry for lastEntry()', () => {
      expect(multiSet.lastEntry()).to.eql({ key: 42, count: 1 });
    });
  });

  describe('entries', () => {
    it('should yield a single entry with the key and count', () => {
      const entries = Array.from(multiSet.entries());
      expect(entries).to.eql([{ key: 42, count: 1 }]);
    });
  });

  describe('keyIterator', () => {
    it('should iterate over the single key', () => {
      const keys = Array.from(multiSet.keyIterator());
      expect(keys).to.eql([42]);
    });
  });

  describe('entryIterator', () => {
    it('should iterate over the single entry', () => {
      const entries = Array.from(multiSet.entryIterator());
      expect(entries).to.eql([{ key: 42, count: 1 }]);
    });
  });

  describe('reverseIterator', () => {
    it('should reverse iterate over the single key', () => {
      const keys = Array.from(multiSet.reverseIterator());
      expect(keys).to.eql([42]);
    });
  });

  describe('reverseEntryIterator', () => {
    it('should reverse iterate over the single entry', () => {
      const entries = Array.from(multiSet.reverseEntryIterator());
      expect(entries).to.eql([{ key: 42, count: 1 }]);
    });
  });

  describe('equals', () => {
    it('should return true for another SingletonMultiSet with the same item', () => {
      const otherMultiSet = new SingletonMultiSet(42);
      expect(multiSet.equals(otherMultiSet)).to.be.true;
    });

    it('should return false for another SingletonMultiSet with a different item', () => {
      const otherMultiSet = new SingletonMultiSet(99);
      expect(multiSet.equals(otherMultiSet)).to.be.false;
    });

    it('should return false for a non-multiSet object', () => {
      expect(multiSet.equals([42])).to.be.false;
    });
  });
});
