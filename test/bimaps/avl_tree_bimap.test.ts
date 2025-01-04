import { expect } from 'chai';
import { createAvlTreeBiMap, IllegalArgumentException, OverflowException } from '../../src';

describe('AvlTreeBiMap', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const map = createAvlTreeBiMap();
      expect(map.capacity()).equal(Infinity);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(Infinity);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const map = createAvlTreeBiMap({ capacity: 2 });
      expect(map.capacity()).equal(2);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(2);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should initialize with the provided Map', () => {
      const map = createAvlTreeBiMap({ initial: new Map().set('a', 1).set('b', 2) });
      expect(map.size()).equal(2);
      expect(map.getValue('a')).equal(1);
      expect(map.getValue('b')).equal(2);
      expect(map.getKey(1)).equal('a');
      expect(map.getKey(2)).equal('b');
    });

    it('should initialize with the provided IMap', () => {
      const map1 = createAvlTreeBiMap();
      map1.put('a', 1);
      map1.put('b', 2);
      const map = createAvlTreeBiMap({ initial: map1 });
      expect(map.getValue('a')).equal(1);
      expect(map.getValue('b')).equal(2);
      expect(map.size()).equal(2);
    });

    it('should initialize with the provided Iterable', () => {
      const map = createAvlTreeBiMap({
        initial: [
          ['a', 1],
          ['b', 2],
        ] as Array<[string, number]>,
      });
      expect(map.size()).equal(2);
      expect(map.getValue('a')).equal(1);
      expect(map.getValue('b')).equal(2);
    });
  });

  describe('put/get', () => {
    it('should return this if key is newly added', () => {
      const map = createAvlTreeBiMap();
      expect(map.put('foo', 4)).to.equal(map);
      expect(map.size()).equal(1);
      expect(map.getValue('foo')).equal(4);
    });
    it('should return the old value if key already present', () => {
      const map = createAvlTreeBiMap();
      map.put('foo', 4);
      expect(() => map.put('foo', 5)).to.throw(IllegalArgumentException);
      expect(map.forcePut('foo', 2)).equal(4);
      expect(map.size()).equal(1);
      expect(map.getValue('foo')).equal(2);
    });

    it('should throw if adding a new element and map is full', () => {
      const map = createAvlTreeBiMap({ capacity: 1 });
      map.put('foo', 1);
      expect(map.forcePut('foo', 2)).equal(1);
      expect(() => map.put('bar', 4)).to.throw(OverflowException);
      expect(() => map.forcePut('bar', 4)).to.throw(OverflowException);
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should return undefined if key is newly added', () => {
      const map = createAvlTreeBiMap();
      const result = map.offer('foo', 4);
      expect(result).to.have.property('accepted', true);
      expect(result.previous).to.be.undefined;
      expect(map.size()).equal(1);
      expect(map.getValue('foo')).equal(4);
    });
    it('should return the old value if key already present', () => {
      const map = createAvlTreeBiMap();
      map.put('foo', 4);
      expect(map.offer('foo', 2)).to.deep.equal({ accepted: true, previous: 4 });
      expect(map.size()).equal(1);
      expect(map.getValue('foo')).equal(2);
    });

    it('should return false if offering a new element and map is full', () => {
      const map = createAvlTreeBiMap({ capacity: 1 });
      map.put('foo', 1);
      expect(map.forcePut('foo', 2)).equal(1);
      expect(map.offer('bar', 3)).to.deep.equal({ accepted: false });
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = createAvlTreeBiMap();
      a.put('foo', 1);
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.put('bar', 2);
      expect(b.size()).equal(2);
      expect(a.size()).equal(1);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const map = createAvlTreeBiMap({ capacity: 3 });
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
      const map = createAvlTreeBiMap();
      expect(map.containsKey('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = createAvlTreeBiMap();
      map.put('foo', 1);
      expect(map.containsKey('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = createAvlTreeBiMap();
      map.put('foo', 1);
      expect(map.containsKey('foo')).to.be.true;
    });
  });

  describe('containsValue', () => {
    it('should return false on empty map', () => {
      const map = createAvlTreeBiMap();
      expect(map.containsValue('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = createAvlTreeBiMap<string, number>();
      map.put('foo', 1);
      expect(map.containsKey('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = createAvlTreeBiMap<string, number>();
      map.put('foo', 1);
      expect(map.containsValue(1)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should return undefined on empty map', () => {
      const map = createAvlTreeBiMap();
      expect(map.removeKey('foo')).to.be.undefined;
      expect(map.removeValue('foo')).to.be.undefined;
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const map = createAvlTreeBiMap();
      map.put('foo', 1);
      expect(map.removeKey('bar')).to.be.undefined;
      expect(map.isEmpty()).to.be.false;
      expect(map.size()).equal(1);
      expect(map.removeKey('foo')).to.equal(1);
    });
  });

  describe('filterKeys', () => {
    it('should remove keys not matching predicate', () => {
      const map = createAvlTreeBiMap<string, number>();
      map.put('foo', 1);
      map.put('bar', 2);
      map.put('foobar', 3);
      expect(map.filterKeys(k => k.startsWith('b'))).equal(2);
      expect(map.size()).equal(1);
      expect(map.containsKey('foo')).to.be.false;
      expect(map.containsKey('foobar')).to.be.false;
      expect(map.containsKey('bar')).to.be.true;
    });
  });

  describe('filterValues', () => {
    it('should remove values not matching predicate', () => {
      const map = createAvlTreeBiMap<string, number>();
      map.put('foo', 1);
      map.put('bar', 2);
      map.put('foobar', 3);
      expect(map.filterValues(v => v % 2 === 0)).equal(2);
      expect(map.size()).equal(1);
      expect(map.containsKey('foo')).to.be.false;
      expect(map.containsKey('foobar')).to.be.false;
      expect(map.containsKey('bar')).to.be.true;
    });
  });

  describe('entries', () => {
    it('should iterate over all entries', () => {
      const map = createAvlTreeBiMap();
      map.put('c', 3);
      map.put('a', 1);
      map.put('b', 2);
      expect(Array.from(map.entries())).deep.equal([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });
});
