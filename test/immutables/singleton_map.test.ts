import { expect } from 'chai';
import { SingletonMap } from '../../src/immutables/singletonMap';

describe('SingletonMap', () => {
  describe('constructor', () => {
    it('should create a map with a single entry', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.size()).to.equal(1);
      expect(map.capacity()).to.equal(1);
      expect(map.isEmpty()).to.be.false;
      expect(map.isFull()).to.be.true;
      expect(map.remaining()).to.equal(0);
    });
  });

  describe('basic operations', () => {
    it('should get value for existing key', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.get('key')).to.equal('value');
    });

    it('should return undefined for non-existing key', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.get('nonexistent')).to.be.undefined;
    });

    it('should get entry for existing key', () => {
      const map = new SingletonMap('key', 'value');
      const entry = map.getEntry('key');
      expect(entry).to.deep.equal({ key: 'key', value: 'value' });
    });

    it('should return undefined entry for non-existing key', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.getEntry('nonexistent')).to.be.undefined;
    });

    it('should check key containment', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.containsKey('key')).to.be.true;
      expect(map.containsKey('nonexistent')).to.be.false;
    });

    it('should check value containment', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.containsValue('value')).to.be.true;
      expect(map.containsValue('nonexistent')).to.be.false;
    });
  });

  describe('navigation operations', () => {
    it('should get first and last entries', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.firstEntry()).to.deep.equal({ key: 'key', value: 'value' });
      expect(map.lastEntry()).to.deep.equal({ key: 'key', value: 'value' });
    });

    it('should get first and last keys', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.firstKey()).to.equal('key');
      expect(map.lastKey()).to.equal('key');
    });
  });

  describe('iteration', () => {
    it('should iterate over keys', () => {
      const map = new SingletonMap('key', 'value');
      expect([...map.keys()]).to.deep.equal(['key']);
      expect([...map.keyIterator()]).to.deep.equal(['key']);
      expect([...map.reverseKeyIterator()]).to.deep.equal(['key']);
    });

    it('should iterate over values', () => {
      const map = new SingletonMap('key', 'value');
      expect([...map.values()]).to.deep.equal(['value']);
      expect([...map.valueIterator()]).to.deep.equal(['value']);
      expect([...map.reverseValueIterator()]).to.deep.equal(['value']);
    });

    it('should iterate over entries', () => {
      const map = new SingletonMap('key', 'value');
      const expectedEntry = { key: 'key', value: 'value' };
      expect([...map.entries()]).to.deep.equal([['key', 'value']]);
      expect([...map.entryIterator()]).to.deep.equal([expectedEntry]);
      expect([...map.reverseEntryIterator()]).to.deep.equal([expectedEntry]);
      expect([...map.reverseEntries()]).to.deep.equal([['key', 'value']]);
      expect([...map]).to.deep.equal([['key', 'value']]);
    });
  });

  describe('immutability', () => {
    it('should return same instance on clone', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.clone()).to.equal(map);
    });

    it('should have frozen entry', () => {
      const map = new SingletonMap('key', 'value');
      const entry = map.firstEntry();
      expect(Object.isFrozen(entry)).to.be.true;
      expect(() => {
        (entry as any).key = 'newkey';
      }).to.throw();
    });
  });

  describe('comparison', () => {
    it('should be equal to itself', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.equals(map)).to.be.true;
    });

    it('should be equal to another singleton map with same entry', () => {
      const map1 = new SingletonMap('key', 'value');
      const map2 = new SingletonMap('key', 'value');
      expect(map1.equals(map2)).to.be.true;
      expect(map2.equals(map1)).to.be.true;
    });

    it('should not be equal to maps with different entries', () => {
      const map1 = new SingletonMap('key1', 'value1');
      const map2 = new SingletonMap('key2', 'value2');
      expect(map1.equals(map2)).to.be.false;
    });

    it('should not be equal to null or non-map objects', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.equals(null)).to.be.false;
      expect(map.equals(undefined)).to.be.false;
      expect(map.equals({})).to.be.false;
      expect(map.equals([])).to.be.false;
    });

    it('should have consistent hashCode', () => {
      const map1 = new SingletonMap('key', 'value');
      const map2 = new SingletonMap('key', 'value');
      expect(map1.hashCode()).to.equal(map2.hashCode());
    });
  });

  describe('conversion', () => {
    it('should convert to Map', () => {
      const map = new SingletonMap('key', 'value');
      const jsMap = map.toMap();
      expect(jsMap).to.be.instanceOf(Map);
      expect(jsMap.size).to.equal(1);
      expect(jsMap.get('key')).to.equal('value');
    });

    it('should have string representation', () => {
      const map = new SingletonMap('key', 'value');
      expect(map.toJSON()).to.equal('{"key":"value"}');
    });
  });
});
