import { expect } from 'chai';
import { SingletonNavigableMultiSet } from '../../src/immutables/singletonNavigableMultiSet';

describe('SingletonNavigableMultiSet', () => {
  describe('constructor', () => {
    it('should create a multiset with natural comparator', () => {
      const set = new SingletonNavigableMultiSet(5);
      expect(set.size()).to.equal(1);
      expect(set.count(5)).to.equal(1);
    });

    it('should create a multiset with custom comparator', () => {
      const set = new SingletonNavigableMultiSet(5, (a, b) => b - a); // Reverse order
      expect(set.size()).to.equal(1);
      expect(set.count(5)).to.equal(1);
    });
  });

  describe('navigation operations', () => {
    let set: SingletonNavigableMultiSet<number>;

    beforeEach(() => {
      set = new SingletonNavigableMultiSet(5);
    });

    describe('lower/higher', () => {
      it('should find lower element', () => {
        expect(set.lower(6)).to.equal(5);
        expect(set.lower(5)).to.be.undefined;
        expect(set.lower(4)).to.be.undefined;
      });

      it('should find lower entry', () => {
        expect(set.lowerEntry(6)).to.deep.equal({ key: 5, count: 1 });
        expect(set.lowerEntry(5)).to.be.undefined;
        expect(set.lowerEntry(4)).to.be.undefined;
      });

      it('should find higher element', () => {
        expect(set.higher(4)).to.equal(5);
        expect(set.higher(5)).to.be.undefined;
        expect(set.higher(6)).to.be.undefined;
      });

      it('should find higher entry', () => {
        expect(set.higherEntry(4)).to.deep.equal({ key: 5, count: 1 });
        expect(set.higherEntry(5)).to.be.undefined;
        expect(set.higherEntry(6)).to.be.undefined;
      });
    });

    describe('floor/ceiling', () => {
      it('should find floor element', () => {
        expect(set.floor(6)).to.equal(5);
        expect(set.floor(5)).to.equal(5);
        expect(set.floor(4)).to.be.undefined;
      });

      it('should find floor entry', () => {
        expect(set.floorEntry(6)).to.deep.equal({ key: 5, count: 1 });
        expect(set.floorEntry(5)).to.deep.equal({ key: 5, count: 1 });
        expect(set.floorEntry(4)).to.be.undefined;
      });

      it('should find ceiling element', () => {
        expect(set.ceiling(4)).to.equal(5);
        expect(set.ceiling(5)).to.equal(5);
        expect(set.ceiling(6)).to.be.undefined;
      });

      it('should find ceiling entry', () => {
        expect(set.ceilingEntry(4)).to.deep.equal({ key: 5, count: 1 });
        expect(set.ceilingEntry(5)).to.deep.equal({ key: 5, count: 1 });
        expect(set.ceilingEntry(6)).to.be.undefined;
      });
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const set = new SingletonNavigableMultiSet(5);
      expect(set.clone()).to.equal(set);
    });
  });

  describe('with custom comparator', () => {
    let set: SingletonNavigableMultiSet<string>;

    beforeEach(() => {
      set = new SingletonNavigableMultiSet('b', (a, b) => b.localeCompare(a)); // Reverse order
    });

    it('should find elements according to custom order', () => {
      expect(set.lower('a')).to.equal('b');
      expect(set.higher('c')).to.equal('b');
      expect(set.floor('a')).to.equal('b');
      expect(set.ceiling('c')).to.equal('b');
    });
  });
});
