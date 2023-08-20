import { LinkedHashMap, Ordering, OverflowException } from '../src';
import { expect } from 'chai';

function collectKeys<K, V>(m: LinkedHashMap<K, V>): K[] {
  return Array.from(m.keys());
}

describe('LinkedHashMap', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const map = LinkedHashMap.create();
      expect(map.capacity()).equal(Infinity);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(Infinity);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const map = LinkedHashMap.create(2);
      expect(map.capacity()).equal(2);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(2);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const map = LinkedHashMap.create({ capacity: 2 });
      expect(map.capacity()).equal(2);
      expect(map.isEmpty()).to.be.true;
    });

    it('should initialize with the provided Map and respect ordering', () => {
      const map = LinkedHashMap.create({ ordering: Ordering.ACCESS, initial: new Map().set('a', 1).set('b', 2) });
      expect(map.size()).equal(2);
      expect(collectKeys(map)).to.deep.equal(['a', 'b']);
      expect(map.get('b')).equal(2);
      expect(map.get('a')).equal(1);
      expect(collectKeys(map)).to.deep.equal(['b', 'a']);
      expect(map.mostRecent().key).equal('a');
      expect(map.leastRecent().key).equal('b');
    });

    it('should initialize with the provided IMap', () => {
      const map1 = LinkedHashMap.create();
      map1.put('a', 1);
      map1.put('b', 2);
      const map = LinkedHashMap.create({ initial: map1 });
      expect(map.size()).equal(2);
      expect(map.get('b')).equal(2);
      expect(map.get('a')).equal(1);
      expect(collectKeys(map)).to.deep.equal(['a', 'b']);
    });

    it('should initialize with the provided Iterable', () => {
      const map = LinkedHashMap.create({
        initial: [
          ['a', 1],
          ['b', 2],
        ] as Array<[string, number]>,
      });
      expect(map.size()).equal(2);
      expect(map.get('a')).equal(1);
      expect(map.get('b')).equal(2);
    });
  });

  describe('put/get', () => {
    it('should return undefined if key is newly added', () => {
      const map = LinkedHashMap.create();
      expect(map.put('foo', 4)).to.be.undefined;
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(4);
    });
    it('should return the old value if key already present', () => {
      const map = LinkedHashMap.create();
      expect(map.put('foo', 4)).to.be.undefined;
      expect(map.put('foo', 2)).equal(4);
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(2);
    });

    it('should throw if adding a new element and map is full', () => {
      const map = LinkedHashMap.create(1);
      expect(map.put('foo', 1)).to.be.undefined;
      expect(map.put('foo', 2)).equal(1);
      expect(() => map.put('bar', 1)).to.throw(OverflowException);
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = LinkedHashMap.create();
      a.put('foo', 1);
      const b = a.clone();
      expect(collectKeys(b)).to.deep.equal(collectKeys(a));
      b.put('bar', 1);
      expect(b.size()).equal(2);
      expect(a.size()).equal(1);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const map = LinkedHashMap.create({ capacity: 3 });
      map.put('a', 1);
      map.put('b', 2);
      expect(map.size()).to.equal(2);
      expect(map.remaining()).to.equal(1);
      map.clear();
      expect(map.size()).to.equal(0);
      expect(map.remaining()).to.equal(3);
    });
  });

  describe('containsKey', () => {
    it('should return false on empty map', () => {
      const map = LinkedHashMap.create();
      expect(map.containsKey('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = LinkedHashMap.create();
      map.put('foo', 1);
      expect(map.containsKey('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = LinkedHashMap.create();
      map.put('foo', 1);
      expect(map.containsKey('foo')).to.be.true;
    });
  });

  describe('containsValue', () => {
    it('should return false on empty map', () => {
      const map = LinkedHashMap.create();
      expect(map.containsValue('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = LinkedHashMap.create();
      map.put('foo', 1);
      expect(map.containsValue('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = LinkedHashMap.create();
      map.put('foo', 1);
      expect(map.containsValue(1)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should return undefined on empty map', () => {
      const map = LinkedHashMap.create();
      expect(map.remove('foo')).to.be.undefined;
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const map = LinkedHashMap.create();
      expect(map.put('foo', 1)).to.be.undefined;
      expect(map.remove('bar')).to.be.undefined;
      expect(map.isEmpty()).to.be.false;
      expect(map.size()).equal(1);
      expect(map.remove('foo')).to.equal(1);
    });
  });

  describe('filterKeys', () => {
    it('should remove keys not matching predicate', () => {
      const map = LinkedHashMap.create<string, number>();
      map.put('foo', 1);
      map.put('bar', 2);
      map.put('foobar', 3);
      map.filterKeys(k => k.startsWith('b'));
      expect(map.size()).equal(1);
      expect(map.containsKey('foo')).to.be.false;
      expect(map.containsKey('foobar')).to.be.false;
      expect(map.containsKey('bar')).to.be.true;
    });
  });
  describe('filterValues', () => {
    it('should remove values not matching predicate', () => {
      const map = LinkedHashMap.create<string, number>();
      map.put('foo', 1);
      map.put('bar', 2);
      map.put('foobar', 3);
      map.filterValues(v => v % 2 === 0);
      expect(map.size()).equal(1);
      expect(map.containsKey('foo')).to.be.false;
      expect(map.containsKey('foobar')).to.be.false;
      expect(map.containsKey('bar')).to.be.true;
    });
  });
});
