import { expect } from 'chai';
import { CuckooFilter } from '../../src/filters/cuckooFilter';
import { PrimitiveSink } from '../../src/utils';

describe('CuckooFilter', () => {
  describe('constructor', () => {
    it('should create a cuckoo filter with default options', () => {
      const filter = new CuckooFilter<string>(100);
      expect(filter.count()).to.equal(0);
    });

    it('should create a cuckoo filter with custom options', () => {
      const filter = new CuckooFilter<string>(100, {
        bucketSize: 4,
        maxKicks: 100,
        fingerPrintSize: 8,
      });
      expect(filter.count()).to.equal(0);
    });
  });

  describe('insert and lookup', () => {
    it('should insert and find elements', () => {
      const filter = new CuckooFilter<string>(100);
      expect(filter.insert('test')).to.be.true;
      expect(filter.lookup('test')).to.be.true;
      expect(filter.count()).to.equal(1);
    });

    it('should handle multiple elements', () => {
      const filter = new CuckooFilter<string>(100);
      const items = ['a', 'b', 'c', 'd'];
      items.forEach(item => expect(filter.insert(item)).to.be.true);
      items.forEach(item => expect(filter.lookup(item)).to.be.true);
      expect(filter.count()).to.equal(items.length);
    });

    it('should handle false positives but not false negatives', () => {
      const filter = new CuckooFilter<string>(10); // Small size to increase collision probability
      const items = ['a', 'b', 'c'];
      items.forEach(item => filter.insert(item));

      // All inserted items must be found (no false negatives)
      items.forEach(item => expect(filter.lookup(item)).to.be.true);

      // May have false positives, but shouldn't find all non-inserted items
      let falsePositives = 0;
      const nonItems = ['x', 'y', 'z', 'w'];
      nonItems.forEach(item => {
        if (filter.lookup(item)) falsePositives++;
      });
      expect(falsePositives).to.be.lessThan(nonItems.length);
    });
  });

  describe('delete', () => {
    it('should delete elements', () => {
      const filter = new CuckooFilter<string>(100);
      filter.insert('test');
      expect(filter.delete('test')).to.be.true;
      expect(filter.lookup('test')).to.be.false;
      expect(filter.count()).to.equal(0);
    });

    it('should return false when deleting non-existent elements', () => {
      const filter = new CuckooFilter<string>(100);
      expect(filter.delete('test')).to.be.false;
    });
  });

  describe('clear', () => {
    it('should clear all elements', () => {
      const filter = new CuckooFilter<string>(100);
      const items = ['a', 'b', 'c'];
      items.forEach(item => filter.insert(item));
      filter.clear();
      expect(filter.count()).to.equal(0);
      items.forEach(item => expect(filter.lookup(item)).to.be.false);
    });
  });

  describe('with funnel', () => {
    interface TestObject {
      id: number;
      value: string;
    }

    const testFunnel = (obj: TestObject, sink: PrimitiveSink) => {
      sink.putNumber(obj.id);
      sink.putString(obj.value);
    };

    it('should work with custom objects using a funnel', () => {
      const filter = new CuckooFilter<TestObject>(100, { funnel: testFunnel });
      const obj1 = { id: 1, value: 'test1' };
      const obj2 = { id: 2, value: 'test2' };

      expect(filter.insert(obj1)).to.be.true;
      expect(filter.insert(obj2)).to.be.true;
      expect(filter.lookup(obj1)).to.be.true;
      expect(filter.lookup(obj2)).to.be.true;
      expect(filter.lookup({ id: 3, value: 'test3' })).to.be.false;
    });
  });

  describe('capacity', () => {
    it('should handle reaching capacity gracefully', () => {
      // Create a small filter to test capacity
      const filter = new CuckooFilter<number>(2, { bucketSize: 2, maxKicks: 10 });

      // Should be able to insert some items
      expect(filter.insert(1)).to.be.true;
      expect(filter.insert(2)).to.be.true;

      // Try to fill beyond capacity
      let insertedCount = 2;
      let i = 3;
      while (filter.insert(i)) {
        insertedCount++;
        i++;
        if (i > 100) break; // Safety limit
      }

      // Verify we hit capacity
      expect(insertedCount).to.be.lessThan(100);
      expect(filter.count()).to.equal(insertedCount);
    });
  });
});
