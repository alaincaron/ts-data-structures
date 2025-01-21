import { expect } from 'chai';
import { SingletonNavigableMap } from '../../src/immutables/singletonNavigableMap';

describe('SingletonNavigableMap', () => {
  describe('constructor', () => {
    it('should create a map with natural comparator', () => {
      const map = new SingletonNavigableMap(5, 'five');
      expect(map.size()).to.equal(1);
      expect(map.get(5)).to.equal('five');
    });

    it('should create a map with custom comparator', () => {
      const map = new SingletonNavigableMap(5, 'five', (a, b) => b - a); // Reverse order
      expect(map.size()).to.equal(1);
      expect(map.get(5)).to.equal('five');
    });
  });

  describe('navigation operations', () => {
    let map: SingletonNavigableMap<number, string>;

    beforeEach(() => {
      map = new SingletonNavigableMap(5, 'five');
    });

    describe('lower/higher', () => {
      it('should find lower key', () => {
        expect(map.lowerKey(6)).to.equal(5);
        expect(map.lowerKey(5)).to.be.undefined;
        expect(map.lowerKey(4)).to.be.undefined;
      });

      it('should find lower entry', () => {
        expect(map.lowerEntry(6)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.lowerEntry(5)).to.be.undefined;
        expect(map.lowerEntry(4)).to.be.undefined;
      });

      it('should find higher key', () => {
        expect(map.higherKey(4)).to.equal(5);
        expect(map.higherKey(5)).to.be.undefined;
        expect(map.higherKey(6)).to.be.undefined;
      });

      it('should find higher entry', () => {
        expect(map.higherEntry(4)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.higherEntry(5)).to.be.undefined;
        expect(map.higherEntry(6)).to.be.undefined;
      });
    });

    describe('floor/ceiling', () => {
      it('should find floor key', () => {
        expect(map.floorKey(6)).to.equal(5);
        expect(map.floorKey(5)).to.equal(5);
        expect(map.floorKey(4)).to.be.undefined;
      });

      it('should find floor entry', () => {
        expect(map.floorEntry(6)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.floorEntry(5)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.floorEntry(4)).to.be.undefined;
      });

      it('should find ceiling key', () => {
        expect(map.ceilingKey(4)).to.equal(5);
        expect(map.ceilingKey(5)).to.equal(5);
        expect(map.ceilingKey(6)).to.be.undefined;
      });

      it('should find ceiling entry', () => {
        expect(map.ceilingEntry(4)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.ceilingEntry(5)).to.deep.equal({ key: 5, value: 'five' });
        expect(map.ceilingEntry(6)).to.be.undefined;
      });
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const map = new SingletonNavigableMap(5, 'five');
      expect(map.clone()).to.equal(map);
    });
  });

  describe('with custom comparator', () => {
    let map: SingletonNavigableMap<string, number>;

    beforeEach(() => {
      map = new SingletonNavigableMap('b', 2, (a, b) => b.localeCompare(a)); // Reverse order
    });

    it('should find elements according to custom order', () => {
      expect(map.lowerKey('a')).to.equal('b');
      expect(map.higherKey('c')).to.equal('b');
      expect(map.floorKey('a')).to.equal('b');
      expect(map.ceilingKey('c')).to.equal('b');
    });
  });
});
