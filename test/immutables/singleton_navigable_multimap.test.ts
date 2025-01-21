import { expect } from 'chai';
import { SingletonNavigableMultiMap } from '../../src/immutables/singletonNavigableMultiMap';

describe('SingletonNavigableMultiMap', () => {
  describe('constructor', () => {
    it('should create a multimap with natural comparator', () => {
      const map = new SingletonNavigableMultiMap(5, 'five');
      expect(map.size()).to.equal(1);
      expect(map.getValues(5)?.toArray()).to.deep.equal(['five']);
    });

    it('should create a multimap with custom comparator', () => {
      const map = new SingletonNavigableMultiMap(5, 'five', (a, b) => b - a); // Reverse order
      expect(map.size()).to.equal(1);
      expect(map.getValues(5)?.toArray()).to.deep.equal(['five']);
    });
  });

  describe('navigation operations', () => {
    let map: SingletonNavigableMultiMap<number, string>;

    beforeEach(() => {
      map = new SingletonNavigableMultiMap(5, 'five');
    });

    describe('lower/higher', () => {
      it('should find lower key', () => {
        expect(map.lowerKey(6)).to.equal(5);
        expect(map.lowerKey(5)).to.be.undefined;
        expect(map.lowerKey(4)).to.be.undefined;
      });

      it('should find lower entry', () => {
        const entry = map.lowerEntry(6);
        expect(entry?.key).to.equal(5);
        expect(entry?.value.toArray()).to.deep.equal(['five']);
        expect(map.lowerEntry(5)).to.be.undefined;
        expect(map.lowerEntry(4)).to.be.undefined;
      });

      it('should find higher key', () => {
        expect(map.higherKey(4)).to.equal(5);
        expect(map.higherKey(5)).to.be.undefined;
        expect(map.higherKey(6)).to.be.undefined;
      });

      it('should find higher entry', () => {
        const entry = map.higherEntry(4);
        expect(entry?.key).to.equal(5);
        expect(entry?.value.toArray()).to.deep.equal(['five']);
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
        const entry = map.floorEntry(6);
        expect(entry?.key).to.equal(5);
        expect(entry?.value.toArray()).to.deep.equal(['five']);
        const entry2 = map.floorEntry(5);
        expect(entry2?.key).to.equal(5);
        expect(entry2?.value.toArray()).to.deep.equal(['five']);
        expect(map.floorEntry(4)).to.be.undefined;
      });

      it('should find ceiling key', () => {
        expect(map.ceilingKey(4)).to.equal(5);
        expect(map.ceilingKey(5)).to.equal(5);
        expect(map.ceilingKey(6)).to.be.undefined;
      });

      it('should find ceiling entry', () => {
        const entry = map.ceilingEntry(4);
        expect(entry?.key).to.equal(5);
        expect(entry?.value.toArray()).to.deep.equal(['five']);
        const entry2 = map.ceilingEntry(5);
        expect(entry2?.key).to.equal(5);
        expect(entry2?.value.toArray()).to.deep.equal(['five']);
        expect(map.ceilingEntry(6)).to.be.undefined;
      });
    });
  });

  describe('with custom comparator', () => {
    let map: SingletonNavigableMultiMap<string, number>;

    beforeEach(() => {
      map = new SingletonNavigableMultiMap('b', 2, (a, b) => b.localeCompare(a)); // Reverse order
    });

    it('should find elements according to custom order', () => {
      expect(map.lowerKey('a')).to.equal('b');
      expect(map.higherKey('c')).to.equal('b');
      expect(map.floorKey('a')).to.equal('b');
      expect(map.ceilingKey('c')).to.equal('b');
    });
  });
});
