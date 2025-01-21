import { expect } from 'chai';
import { emptyMap } from '../../src/immutables';

describe('EmptyMap', () => {
  describe('basic operations', () => {
    it('should always be empty', () => {
      const map = emptyMap<string, number>();
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).to.equal(0);
      expect(map.isFull()).to.be.true;
      expect(map.capacity()).to.equal(0);
      expect(map.remaining()).to.equal(0);
    });

    it('should not contain any key', () => {
      const map = emptyMap<string, number>();
      expect(map.containsKey('any')).to.be.false;
    });

    it('should not contain any value', () => {
      const map = emptyMap<string, number>();
      expect(map.containsValue(0)).to.be.false;
    });

    it('should return undefined for any key', () => {
      const map = emptyMap<string, number>();
      expect(map.get('any')).to.be.undefined;
      expect(map.getEntry('any')).to.be.undefined;
    });
  });

  describe('navigation operations', () => {
    it('should return undefined for all navigation methods', () => {
      const map = emptyMap<string, number>();
      expect(map.firstEntry()).to.be.undefined;
      expect(map.lastEntry()).to.be.undefined;
      expect(map.lowerEntry('any')).to.be.undefined;
      expect(map.higherEntry('any')).to.be.undefined;
      expect(map.floorEntry('any')).to.be.undefined;
      expect(map.ceilingEntry('any')).to.be.undefined;
      expect(map.firstKey()).to.be.undefined;
      expect(map.lastKey()).to.be.undefined;
      expect(map.lowerKey('any')).to.be.undefined;
      expect(map.higherKey('any')).to.be.undefined;
      expect(map.floorKey('any')).to.be.undefined;
      expect(map.ceilingKey('any')).to.be.undefined;
    });
  });

  describe('iteration', () => {
    it('should have empty iterators', () => {
      const map = emptyMap<string, number>();
      expect([...map.keys()]).to.be.empty;
      expect([...map.values()]).to.be.empty;
      expect([...map.entries()]).to.be.empty;
      expect([...map.keyIterator()]).to.be.empty;
      expect([...map.valueIterator()]).to.be.empty;
      expect([...map.entryIterator()]).to.be.empty;
      expect([...map.reverseKeyIterator()]).to.be.empty;
      expect([...map.reverseValueIterator()]).to.be.empty;
      expect([...map.reverseEntryIterator()]).to.be.empty;
      expect([...map.reverseEntries()]).to.be.empty;
      expect([...map]).to.be.empty;
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const map = emptyMap<string, number>();
      expect(map.clone()).to.equal(map);
    });
  });

  describe('comparison', () => {
    it('should be equal to another empty map', () => {
      const map1 = emptyMap<string, number>();
      const map2 = emptyMap<string, number>();
      expect(map1.equals(map2)).to.be.true;
      expect(map2.equals(map1)).to.be.true;
    });

    it('should not be equal to null or non-map objects', () => {
      const map = emptyMap<string, number>();
      expect(map.equals(null)).to.be.false;
      expect(map.equals(undefined)).to.be.false;
      expect(map.equals({})).to.be.false;
      expect(map.equals([])).to.be.false;
    });

    it('should have consistent hashCode', () => {
      const map1 = emptyMap<string, number>();
      const map2 = emptyMap<string, number>();
      expect(map1.hashCode()).to.equal(map2.hashCode());
    });
  });

  describe('conversion', () => {
    it('should convert to empty Map', () => {
      const map = emptyMap<string, number>();
      expect(map.toMap()).to.be.instanceOf(Map);
      expect(map.toMap().size).to.equal(0);
    });

    it('should have empty string representation', () => {
      const map = emptyMap<string, number>();
      expect(map.toJSON()).to.equal('{}');
    });
  });
});
