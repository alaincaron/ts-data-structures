import { expect } from 'chai';
import { AdapterArrayList } from '../../src';

describe('AdapterArrayList', () => {
  describe('constructor', () => {
    it('should have infinite capacity as per default ctor', () => {
      const list = AdapterArrayList.create();
      expect(list.capacity()).equal(Infinity);
      expect(list.size()).equal(0);
      expect(list.remaining()).equal(Infinity);
      expect(list.isEmpty()).to.be.true;
      expect(list.isFull()).to.be.false;
    });

    it('should have specified capacity', () => {
      const list = AdapterArrayList.create({ capacity: 2 });
      expect(list.capacity()).equal(2);
      expect(list.size()).equal(0);
      expect(list.remaining()).equal(2);
      expect(list.isEmpty()).to.be.true;
      expect(list.isFull()).to.be.false;
    });

    it('toArray should return the internal array', () => {
      const arr = [1, 2];
      const list = AdapterArrayList.create({ delegate: arr });
      expect(list.capacity()).equal(Infinity);
      expect(list.size()).equal(2);
      expect(list.remaining()).equal(Infinity);
      expect(list.isEmpty()).to.be.false;
      expect(list.isFull()).to.be.false;
      expect(list.toArray()).equal(arr);
      arr.push(3);
      expect(list.size()).equal(3);
      list.filter(x => x % 2 === 1);
      expect(arr).deep.equal([1, 3]);
      expect(list.size()).equal(2);
    });

    it('clone should return a new AdapterArrayList with its own array', () => {
      const arr = [1, 2];
      const list = AdapterArrayList.create({ capacity: 5, delegate: arr });
      const list1 = list.clone();
      expect(list1.constructor).eq(list.constructor);
      expect(list.toArray()).eq(arr);
      expect(list1.toArray()).not.eq(arr);
    });
  });
});
