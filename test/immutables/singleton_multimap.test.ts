import { expect } from 'chai';
import { SingletonList } from '../../src/immutables/singletonList';
import { SingletonMultiMap } from '../../src/immutables/singletonMultiMap';

describe('SingletonMultiMap', () => {
  describe('constructor', () => {
    it('should create a multimap with a single entry', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.size()).to.equal(1);
      expect(map.capacity()).to.equal(1);
      expect(map.isEmpty()).to.be.false;
      expect(map.isFull()).to.be.true;
      expect(map.remaining()).to.equal(0);
    });
  });

  describe('basic operations', () => {
    it('should get values for existing key', () => {
      const map = new SingletonMultiMap('key', 'value');
      const values = map.getValues('key');
      expect(values).to.be.instanceOf(SingletonList);
      expect([...values!]).to.deep.equal(['value']);
    });

    it('should return undefined for non-existing key', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.getValues('nonexistent')).to.be.undefined;
    });

    it('should check key containment', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.containsKey('key')).to.be.true;
      expect(map.containsKey('nonexistent')).to.be.false;
    });

    it('should check value containment', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.containsValue('value')).to.be.true;
      expect(map.containsValue('nonexistent')).to.be.false;
    });

    it('should check entry containment', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.containsEntry('key', 'value')).to.be.true;
      expect(map.containsEntry('key', 'nonexistent')).to.be.false;
      expect(map.containsEntry('nonexistent', 'value')).to.be.false;
    });
  });

  describe('navigation operations', () => {
    it('should get first and last entries', () => {
      const map = new SingletonMultiMap('key', 'value');
      const expectedEntry = { key: 'key', value: new SingletonList('value') };
      expect(map.firstEntry()).to.deep.equal(expectedEntry);
      expect(map.lastEntry()).to.deep.equal(expectedEntry);
      expect(map['getEntry']()).to.deep.equal(expectedEntry); // Test getEntry
    });

    it('should iterate entries in reverse', () => {
      const map = new SingletonMultiMap('key', 'value');
      const expectedEntry = { key: 'key', value: new SingletonList('value') };
      const iterator = map.reverseEntryIterator();
      expect([...iterator]).to.deep.equal([expectedEntry]);
    });
  });

  describe('iteration', () => {
    it('should iterate over keys', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect([...map.keys()]).to.deep.equal(['key']);
      expect([...map.keyIterator()]).to.deep.equal(['key']);
      expect([...map.reverseKeyIterator()]).to.deep.equal(['key']);
    });

    it('should iterate over values', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect([...map.values()]).to.deep.equal(['value']);
      expect([...map.valueIterator()]).to.deep.equal(['value']);
      expect([...map.reverseValueIterator()]).to.deep.equal(['value']);
    });

    it('should iterate over entries', () => {
      const map = new SingletonMultiMap('key', 'value');
      const expectedEntry = ['key', 'value'] as [string, string];
      expect([...map.entries()]).to.deep.equal([expectedEntry]);
      expect([...map.entryIterator()]).to.deep.equal([expectedEntry]);
      expect([...map]).to.deep.equal([expectedEntry]);
    });

    it('should iterate over partitions', () => {
      const map = new SingletonMultiMap('key', 'value');
      const expectedPartition = ['key', new SingletonList('value')] as [string, SingletonList<string>];
      expect([...map.partitions()]).to.deep.equal([expectedPartition]);
      expect([...map.partitionIterator()]).to.deep.equal([expectedPartition]);
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.clone()).to.equal(map);
    });
  });

  describe('comparison', () => {
    it('should be equal to itself', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.equals(map)).to.be.true;
    });

    it('should be equal to another singleton multimap with same entry', () => {
      const map1 = new SingletonMultiMap('key', 'value');
      const map2 = new SingletonMultiMap('key', 'value');
      expect(map1.equals(map2)).to.be.true;
      expect(map2.equals(map1)).to.be.true;
    });

    it('should not be equal to maps with different entries', () => {
      const map1 = new SingletonMultiMap('key1', 'value1');
      const map2 = new SingletonMultiMap('key2', 'value2');
      expect(map1.equals(map2)).to.be.false;
    });

    it('should not be equal to null or non-multimap objects', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.equals(null)).to.be.false;
      expect(map.equals(undefined)).to.be.false;
      expect(map.equals({})).to.be.false;
      expect(map.equals([])).to.be.false;
    });

    it('should have consistent hashCode', () => {
      const map1 = new SingletonMultiMap('key', 'value');
      const map2 = new SingletonMultiMap('key', 'value');
      expect(map1.hashCode()).to.equal(map2.hashCode());
    });
  });

  describe('conversion', () => {
    it('should have string representation', () => {
      const map = new SingletonMultiMap('key', 'value');
      expect(map.toJSON()).to.equal('{"key":["value"]}');
    });
  });
});
