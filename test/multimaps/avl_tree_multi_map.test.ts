import { expect } from 'chai';
import { list } from './helper';
import { AvlTreeMultiMap, OverflowException } from '../../src';

describe('AvlTreeMultiMap', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const map = new AvlTreeMultiMap();
      expect(map.capacity()).equal(Infinity);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(Infinity);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should have specified capacity as unique argument', () => {
      const map = new AvlTreeMultiMap(2);
      expect(map.capacity()).equal(2);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(2);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
    });

    it('should use the specified capacity as per options', () => {
      const map = new AvlTreeMultiMap({ capacity: 2 });
      expect(map.capacity()).equal(2);
      expect(map.isEmpty()).to.be.true;
    });

    it('should initialize with the provided Map', () => {
      const map = AvlTreeMultiMap.create({ initial: new Map().set('a', 1).set('b', 2) });
      expect(map.size()).equal(2);
      expect(map.get('a')?.equals(list(1))).to.be.true;
      expect(map.get('b')?.equals(list(2))).to.be.true;
    });

    it('should initialize with the provided IMap', () => {
      const map1 = new AvlTreeMultiMap();
      map1.put('a', 1);
      map1.put('b', 2);
      const map = AvlTreeMultiMap.create({ initial: map1 });
      expect(map.size()).equal(2);
      expect(map.get('a')?.equals(list(1))).to.be.true;
      expect(map.get('b')?.equals(list(2))).to.be.true;
    });

    it('should initialize with the provided Iterable', () => {
      const map = AvlTreeMultiMap.create({
        initial: [
          ['a', 1],
          ['b', 2],
          ['a', 3],
          ['b', 4],
        ] as Array<[string, number]>,
      });
      expect(map.size()).equal(4);
      expect(map.get('a')?.equals(list(1, 3))).to.be.true;
      expect(map.get('b')?.equals(list(2, 4))).to.be.true;
    });
  });

  describe('put/get', () => {
    it('should return undefined if key is newly added', () => {
      const map = new AvlTreeMultiMap();
      expect(map.put('foo', 4)).to.be.true;
      expect(map.size()).equal(1);
      expect(map.get('foo')?.equals(list(4))).to.be.true;
    });
    it('should return the old value if key already present', () => {
      const map = new AvlTreeMultiMap();
      expect(map.put('foo', 4)).to.be.true;
      expect(map.put('foo', 2)).to.be.true;
      expect(map.size()).equal(2);
      expect(map.get('foo')?.equals(list(4, 2))).to.be.true;
    });

    it('should throw if adding a new element and map is full', () => {
      const map = new AvlTreeMultiMap(1);
      expect(map.put('foo', 1)).to.be.true;
      expect(() => map.put('bar', 1)).to.throw(OverflowException);
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should return true if key is accpeted and added', () => {
      const map = new AvlTreeMultiMap();
      expect(map.offer('foo', 4)).to.be.true;
      expect(map.size()).equal(1);
      expect(map.get('foo')?.equals(list(4))).to.be.true;
    });
    it('should return true if key already present', () => {
      const map = new AvlTreeMultiMap();
      expect(map.put('foo', 4)).to.be.true;
      expect(map.offer('foo', 2)).to.be.true;
      expect(map.size()).equal(2);
      expect(map.get('foo')?.equals(list(4, 2))).to.be.true;
    });

    it('should return false if map is full', () => {
      const map = new AvlTreeMultiMap(1);
      expect(map.put('foo', 1)).to.be.true;
      expect(map.offer('foo', 1)).to.be.false;
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new AvlTreeMultiMap();
      a.put('foo', 1);
      const b = a.clone();
      expect(b).to.deep.equal(a);
      b.put('bar', 1);
      expect(b.size()).equal(2);
      expect(a.size()).equal(1);
    });
  });

  describe('clear', () => {
    it('should clear the content', () => {
      const map = new AvlTreeMultiMap({ capacity: 3 });
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
      const map = new AvlTreeMultiMap();
      expect(map.containsKey('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = new AvlTreeMultiMap();
      map.put('foo', 1);
      expect(map.containsKey('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = new AvlTreeMultiMap();
      map.put('foo', 1);
      expect(map.containsKey('foo')).to.be.true;
    });
  });

  describe('containsValue', () => {
    it('should return false on empty map', () => {
      const map = new AvlTreeMultiMap();
      expect(map.containsValue('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = new AvlTreeMultiMap();
      map.put('foo', 1);
      expect(map.containsValue('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = new AvlTreeMultiMap();
      map.put('foo', 1);
      expect(map.containsValue(1)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should return undefined on empty map', () => {
      const map = new AvlTreeMultiMap();
      expect(map.removeKey('foo')).to.be.undefined;
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const map = new AvlTreeMultiMap();
      expect(map.put('foo', 1)).to.be.true;
      expect(map.removeKey('bar')).to.be.undefined;
      expect(map.isEmpty()).to.be.false;
      expect(map.size()).equal(1);
      expect(map.removeKey('foo')?.equals(list(1))).to.be.true;
    });
  });

  describe('removeEntry', () => {
    it('should return undefined on empty map', () => {
      const map = new AvlTreeMultiMap();
      expect(map.removeEntry('foo', 1)).to.be.false;
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const map = new AvlTreeMultiMap();
      expect(map.put('foo', 1)).to.be.true;
      expect(map.removeEntry('foo', 2)).to.be.false;
      expect(map.isEmpty()).to.be.false;
      expect(map.size()).equal(1);
      expect(map.removeEntry('foo', 1)).to.be.true;
      expect(map.isEmpty()).to.be.true;
    });
  });

  describe('filterKeys', () => {
    it('should remove keys not matching predicate', () => {
      const map = new AvlTreeMultiMap<string, number>();
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
      const map = new AvlTreeMultiMap<string, number>();
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

  describe('containsEntry', () => {
    it('should return whether an entry is present or not', () => {
      const map = new AvlTreeMultiMap<string, number>();
      map.put('foo', 1);
      expect(map.containsEntry('foo', 1)).to.be.true;
      expect(map.containsEntry('foo', 2)).to.be.false;
      expect(map.containsEntry('foobar', 1)).to.be.false;
    });
  });

  describe('iterators', () => {
    const map = new AvlTreeMultiMap<string, number>();
    map.put('foo', 1);
    map.put('bar', 2);
    map.put('foobar', 3);
    map.put('foo', 4);
    map.put('foobar', 5);
    const sortedKeys = ['bar', 'foo', 'foobar'];
    it('keys should return all the keys in sorted order', () => {
      expect(Array.from(map.keys())).to.deep.equal(sortedKeys);
    });
    it('keyIterator should return all the keys in sorted order', () => {
      expect(map.keyIterator().collect()).to.deep.equal(sortedKeys);
    });
    it('entryIterator should return all entries sorted according to their key', () => {
      expect(map.entryIterator().collect()).to.deep.equal([
        ['bar', 2],
        ['foo', 1],
        ['foo', 4],
        ['foobar', 3],
        ['foobar', 5],
      ]);
    });
    it('valueIterator should return all values ordered according to the their key order', () => {
      expect(map.valueIterator().collect()).to.deep.equal([2, 1, 4, 3, 5]);
    });
    it('partitionIterator should return partitions ordered according to their key order', () => {
      const result = map.partitionIterator().collect();
      expect(result.length === 3);
      expect(result[0][0]).equal('bar');
      expect(result[0][1]?.equals(list(2))).to.be.true;
      expect(result[1][0]).equal('foo');
      expect(result[1][1]?.equals(list(1, 4))).to.be.true;
      expect(result[2][0]).equal('foobar');
      expect(result[2][1]?.equals(list(3, 5))).to.be.true;
    });
  });
});
