import { expect } from 'chai';
import { AvlNode, AvlTreeMap, OverflowException } from '../src';

function assertAvlProperty<K, V>(map: AvlTreeMap<K, V>) {
  function assertAvlProperty0<K, V>(map: AvlTreeMap<K, V>, root: AvlNode<K, V>): number {
    if (root.left) {
      expect(map.comparator(root.left.key, root.key)).to.be.lessThan(0);
    }

    if (root.right) {
      expect(map.comparator(root.right.key, root.key)).to.be.greaterThan(0);
    }

    const leftHeight = root.left ? assertAvlProperty0(map, root.left) : -1;
    const rightHeight = root.right ? assertAvlProperty0(map, root.right) : -1;

    expect(Math.abs(rightHeight - leftHeight)).to.be.lessThanOrEqual(1);

    const computedHeight = Math.max(rightHeight, leftHeight) + 1;

    expect(computedHeight).equal(root.height);
    return computedHeight;
  }

  const root = map.getRoot();
  if (root) assertAvlProperty0(map, root);
}

describe('AvlTreeMap', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const map = new AvlTreeMap();
      expect(map.capacity()).equal(Infinity);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(Infinity);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
      assertAvlProperty(map);
    });

    it('should have specified capacity as unique argument', () => {
      const map = new AvlTreeMap(2);
      expect(map.capacity()).equal(2);
      expect(map.size()).equal(0);
      expect(map.remaining()).equal(2);
      expect(map.isEmpty()).to.be.true;
      expect(map.isFull()).to.be.false;
      assertAvlProperty(map);
    });

    it('should use the specified capacity as per options', () => {
      const map = new AvlTreeMap({ capacity: 2 });
      expect(map.capacity()).equal(2);
      expect(map.isEmpty()).to.be.true;
      assertAvlProperty(map);
    });

    it('should initialize with the provided Map', () => {
      const map = AvlTreeMap.create({ initial: new Map().set('a', 1).set('b', 2) });
      expect(map.size()).equal(2);
      expect(map.get('a')).equal(1);
      expect(map.get('b')).equal(2);
      assertAvlProperty(map);
    });

    it('should initialize with the provided IMap', () => {
      const map1 = new AvlTreeMap();
      map1.put('a', 1);
      map1.put('b', 2);
      const map = AvlTreeMap.create({ initial: map1 });
      expect(map.get('a')).equal(1);
      expect(map.get('b')).equal(2);
      expect(map.size()).equal(2);
      assertAvlProperty(map);
    });

    it('should initialize with the provided Iterable', () => {
      const map = AvlTreeMap.create({
        initial: [
          ['a', 1],
          ['b', 2],
        ] as Array<[string, number]>,
      });
      expect(map.size()).equal(2);
      expect(map.get('a')).equal(1);
      expect(map.get('b')).equal(2);
      assertAvlProperty(map);
    });
  });

  describe('put/get', () => {
    it('should return undefined if key is newly added', () => {
      const map = new AvlTreeMap();
      expect(map.put('foo', 4)).to.be.undefined;
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(4);
      assertAvlProperty(map);
    });
    it('should return the old value if key already present', () => {
      const map = new AvlTreeMap();
      expect(map.put('foo', 4)).to.be.undefined;
      expect(map.put('foo', 2)).equal(4);
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(2);
      assertAvlProperty(map);
    });

    it('should throw if adding a new element and map is full', () => {
      const map = new AvlTreeMap(1);
      expect(map.put('foo', 1)).to.be.undefined;
      expect(map.put('foo', 2)).equal(1);
      expect(() => map.put('bar', 1)).to.throw(OverflowException);
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('offer', () => {
    it('should return undefined if key is newly added', () => {
      const map = new AvlTreeMap();
      expect(map.offer('foo', 4)).to.deep.equal({ accepted: true });
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(4);
    });
    it('should return the old value if key already present', () => {
      const map = new AvlTreeMap();
      expect(map.put('foo', 4)).to.be.undefined;
      expect(map.offer('foo', 2)).to.deep.equal({ accepted: true, previous: 4 });
      expect(map.size()).equal(1);
      expect(map.get('foo')).equal(2);
    });

    it('should return false if offering a new element and map is full', () => {
      const map = new AvlTreeMap(1);
      expect(map.put('foo', 1)).to.be.undefined;
      expect(map.put('foo', 2)).equal(1);
      expect(map.offer('bar', 1)).to.deep.equal({ accepted: false });
      expect(map.isFull()).to.be.true;
      expect(map.size()).equal(1);
    });
  });

  describe('clone', () => {
    it('should create a deep equal copy', () => {
      const a = new AvlTreeMap();
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
      const map = new AvlTreeMap({ capacity: 3 });
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
      const map = new AvlTreeMap();
      expect(map.containsKey('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = new AvlTreeMap();
      map.put('foo', 1);
      expect(map.containsKey('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = new AvlTreeMap();
      map.put('foo', 1);
      expect(map.containsKey('foo')).to.be.true;
    });
  });

  describe('containsValue', () => {
    it('should return false on empty map', () => {
      const map = new AvlTreeMap();
      expect(map.containsValue('foo')).to.be.false;
    });
    it('should return false if absent', () => {
      const map = new AvlTreeMap();
      map.put('foo', 1);
      expect(map.containsValue('bar')).to.be.false;
    });
    it('should return true if present', () => {
      const map = new AvlTreeMap();
      map.put('foo', 1);
      expect(map.containsValue(1)).to.be.true;
    });
  });

  describe('remove', () => {
    it('should return undefined on empty map', () => {
      const map = new AvlTreeMap();
      expect(map.remove('foo')).to.be.undefined;
      expect(map.isEmpty()).to.be.true;
      expect(map.size()).equal(0);
    });
    it('should return false if item is missing', () => {
      const map = new AvlTreeMap();
      expect(map.put('foo', 1)).to.be.undefined;
      expect(map.remove('bar')).to.be.undefined;
      expect(map.isEmpty()).to.be.false;
      expect(map.size()).equal(1);
      expect(map.remove('foo')).to.equal(1);
    });
  });

  describe('filterKeys', () => {
    it('should remove keys not matching predicate', () => {
      const map = new AvlTreeMap<string, number>();
      map.put('foo', 1);
      map.put('bar', 2);
      map.put('foobar', 3);
      expect(map.filterKeys(k => k.startsWith('b'))).equal(2);
      expect(map.size()).equal(1);
      expect(map.containsKey('foo')).to.be.false;
      expect(map.containsKey('foobar')).to.be.false;
      expect(map.containsKey('bar')).to.be.true;
      assertAvlProperty(map);
    });
  });

  describe('filterValues', () => {
    it('should remove values not matching predicate', () => {
      const map = new AvlTreeMap<string, number>();
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
      const map = new AvlTreeMap();
      map.put('c', 3);
      map.put('a', 1);
      map.put('b', 2);
      expect(map.get('a')).equal(1);
      expect(map.get('b')).equal(2);
      expect(map.get('c')).equal(3);
      expect(map.size()).equal(3);
      expect(Array.from(map.entries())).deep.equal([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      assertAvlProperty(map);
    });
  });

  describe('pseudoRandomInsert', () => {
    it('should return elements in the right order', () => {
      const map = new AvlTreeMap();
      const num = 5000;
      const gap = 307;
      for (let i = gap; i != 0; i = (i + gap) % num) {
        expect(map.put(i, i)).to.be.undefined;
      }
      assertAvlProperty(map);

      for (let i = num - 1; i >= 1; --i) {
        expect(map.pollLastEntry()!.value).equal(i);
      }

      expect(map.isEmpty()).to.be.true;
    });
  });

  describe('lastEntry/pollLastEntry/lastKey', () => {
    it('should return undefined on empty map', () => {
      const map = new AvlTreeMap();
      expect(map.lastEntry()).to.be.undefined;
      expect(map.pollLastEntry()).to.be.undefined;
    });
    it('should return the last entry', () => {
      const map = AvlTreeMap.create({
        initial: [
          ['b', 1],
          ['a', 2],
        ] as Array<[string, number]>,
      });
      const e1 = map.lastEntry()!;
      expect(e1).not.to.be.undefined;
      expect(e1.key).equal('b');
      expect(e1.value).equal(1);

      expect(map.lastKey()).equal('b');

      const e2 = map.pollLastEntry();
      expect(e2).deep.equal(e1);
      expect(map.size()).equal(1);
    });
  });

  describe('firstEntry/pollFirstEntry/firstKey', () => {
    it('should return undefined on empty map', () => {
      const map = new AvlTreeMap();
      expect(map.firstEntry()).to.be.undefined;
      expect(map.pollFirstEntry()).to.be.undefined;
    });
    it('should return the first entry', () => {
      const map = AvlTreeMap.create({
        initial: [
          ['b', 1],
          ['a', 2],
        ] as Array<[string, number]>,
      });
      const e1 = map.firstEntry()!;
      expect(e1).not.to.be.undefined;
      expect(e1.key).equal('a');
      expect(e1.value).equal(2);

      expect(map.firstKey()).equal('a');

      const e2 = map.pollFirstEntry();
      expect(e2).deep.equal(e1);
      expect(map.size()).equal(1);
    });
  });

  describe('lowerEntry', () => {
    it('should resolve lowerEntry', () => {
      const map = new AvlTreeMap();
      map.put('a', 1);
      map.put('b', 2);

      let e = map.lowerEntry('z')!;
      expect(e.key).equal('b');
      expect(e.value).equal(2);
      expect(map.lowerKey('z')).equal('b');

      e = map.lowerEntry('b')!;
      expect(e.key).equal('a');
      expect(e.value).equal(1);
      expect(map.lowerKey('b')).equal('a');

      expect(map.lowerEntry('A')).to.be.undefined;
      expect(map.lowerKey('A')).to.be.undefined;

      expect(map.lowerEntry('a')).to.be.undefined;
      expect(map.lowerKey('a')).to.be.undefined;
    });
  });

  describe('higherEntry', () => {
    it('should resolve lowerEntry', () => {
      const map = new AvlTreeMap();
      map.put('a', 1);
      map.put('b', 2);

      let e = map.higherEntry('a')!;
      expect(e.key).equal('b');
      expect(e.value).equal(2);
      expect(map.higherKey('a')).equal('b');

      e = map.higherEntry('A')!;
      expect(e.key).equal('a');
      expect(e.value).equal(1);
      expect(map.higherKey('A')).equal('a');

      expect(map.higherEntry('z')).to.be.undefined;
      expect(map.higherKey('z')).to.be.undefined;

      expect(map.higherEntry('b')).to.be.undefined;
      expect(map.higherKey('b')).to.be.undefined;
    });
  });

  describe('floorEntry', () => {
    it('should resolve floorEntry', () => {
      const map = new AvlTreeMap();
      map.put('a', 1);
      map.put('b', 2);

      let e = map.floorEntry('z')!;
      expect(e.key).equal('b');
      expect(e.value).equal(2);
      expect(map.floorKey('z')).equal('b');

      e = map.floorEntry('b')!;
      expect(e.key).equal('b');
      expect(e.value).equal(2);
      expect(map.floorKey('b')).equal('b');

      e = map.floorEntry('a')!;
      expect(e.key).equal('a');
      expect(e.value).equal(1);
      expect(map.floorKey('a')).equal('a');

      expect(map.floorEntry('A')).to.be.undefined;
      expect(map.floorKey('A')).to.be.undefined;
    });
  });

  describe('ceilingEntry', () => {
    it('should resolve floorEntry', () => {
      const map = new AvlTreeMap();
      map.put('a', 1);
      map.put('b', 2);

      let e = map.ceilingEntry('a')!;
      expect(e.key).equal('a');
      expect(e.value).equal(1);
      expect(map.ceilingKey('a')).equal('a');

      e = map.ceilingEntry('A')!;
      expect(e.key).equal('a');
      expect(e.value).equal(1);
      expect(map.ceilingKey('A')).equal('a');

      e = map.ceilingEntry('b')!;
      expect(e.key).equal('b');
      expect(e.value).equal(2);
      expect(map.ceilingKey('b')).equal('b');

      expect(map.ceilingEntry('z')).to.be.undefined;
      expect(map.ceilingKey('z')).to.be.undefined;
    });
  });
});
