import { expect } from 'chai';
import { EmptyMultiMap } from '../../src/immutables/emptyMultiMap';

describe('EmptyMultiMap', () => {
  describe('basic operations', () => {
    it('should always be empty', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).to.equal(0);
      expect(map.isFull()).to.be.true;
      expect(map.capacity()).to.equal(0);
      expect(map.remaining()).to.equal(0);
    });

    it('should not contain any key', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.containsKey('any')).to.be.false;
    });

    it('should not contain any value', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.containsValue(0)).to.be.false;
    });

    it('should not contain any entry', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.containsEntry('any', 0)).to.be.false;
    });

    it('should return undefined for any key', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.getValues('any')).to.be.undefined;
    });
  });

  describe('navigation operations', () => {
    it('should return undefined for all navigation methods', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.firstEntry()).to.be.undefined;
      expect(map.lastEntry()).to.be.undefined;
      expect(map.lowerEntry('any')).to.be.undefined;
      expect(map.higherEntry('any')).to.be.undefined;
      expect(map.floorEntry('any')).to.be.undefined;
      expect(map.ceilingEntry('any')).to.be.undefined;
      expect(map.firstEntry()).to.be.undefined;
      expect(map.lastEntry()).to.be.undefined;
      expect(map.lowerKey('any')).to.be.undefined;
      expect(map.higherKey('any')).to.be.undefined;
      expect(map.floorKey('any')).to.be.undefined;
      expect(map.ceilingKey('any')).to.be.undefined;
    });
  });

  describe('iteration', () => {
    it('should have empty iterators', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect([...map.keys()]).to.be.empty;
      expect([...map.values()]).to.be.empty;
      expect([...map.entries()]).to.be.empty;
      expect([...map.partitions()]).to.be.empty;
      expect([...map.keyIterator()]).to.be.empty;
      expect([...map.valueIterator()]).to.be.empty;
      expect([...map.entryIterator()]).to.be.empty;
      expect([...map.partitionIterator()]).to.be.empty;
      expect([...map.reverseKeyIterator()]).to.be.empty;
      expect([...map.reverseValueIterator()]).to.be.empty;
      expect([...map.reverseEntryIterator()]).to.be.empty;
      expect([...map]).to.be.empty;
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.clone()).to.equal(map);
    });
  });

  describe('comparison', () => {
    it('should be equal to another empty multimap', () => {
      const map1 = EmptyMultiMap.instance<string, number>();
      const map2 = EmptyMultiMap.instance<string, number>();
      expect(map1.equals(map2)).to.be.true;
      expect(map2.equals(map1)).to.be.true;
    });

    it('should not be equal to null or non-multimap objects', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.equals(null)).to.be.false;
      expect(map.equals(undefined)).to.be.false;
      expect(map.equals({})).to.be.false;
      expect(map.equals([])).to.be.false;
    });

    it('should have consistent hashCode', () => {
      const map1 = EmptyMultiMap.instance<string, number>();
      const map2 = EmptyMultiMap.instance<string, number>();
      expect(map1.hashCode()).to.equal(map2.hashCode());
    });
  });

  describe('conversion', () => {
    it('should have empty string representation', () => {
      const map = EmptyMultiMap.instance<string, number>();
      expect(map.toJSON()).to.equal('{}');
    });
  });
});
