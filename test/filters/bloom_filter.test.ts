import { expect } from 'chai';
import { BloomFilter, BloomFilterOptions, Cyrb53HashFunction, Funnel, PrimitiveSink } from '../../src';

describe('BloomFilter', () => {
  describe('constructor', () => {
    it('should create a bloom filter with specified size', () => {
      const filter = new BloomFilter<string>(100);
      expect(filter.size()).to.equal(100);
      expect(filter.count()).to.equal(0);
    });

    it('should create a bloom filter with custom hash functions', () => {
      const options: BloomFilterOptions<string> = {
        hashFunctions: [(s: string) => s.length, (s: string) => s.charCodeAt(0)],
      };
      const filter = new BloomFilter<string>(100, options);
      expect(filter.size()).to.equal(100);
    });

    it('should create a bloom filter with hash function instances', () => {
      const options: BloomFilterOptions<string> = {
        hashFunctions: [Cyrb53HashFunction.instance()],
      };
      const filter = new BloomFilter<string>(100, options);
      expect(filter.size()).to.equal(100);
    });

    it('should generate additional hash functions when requested', () => {
      const options: BloomFilterOptions<string> = {
        hashFunctions: [(s: string) => s.length],
        generate: 3, // Should generate 2 more hash functions
      };
      const filter = new BloomFilter<string>(100, options);
      filter.add('test');
      // The string 'test' should have different hash values due to multiple functions
      expect(filter.contains('test')).to.be.true;
    });
  });

  describe('add and contains', () => {
    let filter: BloomFilter<string>;

    beforeEach(() => {
      filter = new BloomFilter<string>(100);
    });

    it('should add elements and detect their presence', () => {
      filter.add('test1');
      filter.add('test2');
      expect(filter.contains('test1')).to.be.true;
      expect(filter.contains('test2')).to.be.true;
      expect(filter.count()).to.equal(2);
    });

    it('should handle false positives but not false negatives', () => {
      // Add several elements to increase probability of false positives
      for (let i = 0; i < 50; i++) {
        filter.add(`element${i}`);
      }

      // All added elements must be detected
      for (let i = 0; i < 50; i++) {
        expect(filter.contains(`element${i}`)).to.be.true;
      }
    });

    it('should handle negative hash values correctly', () => {
      const options: BloomFilterOptions<number> = {
        hashFunctions: [(n: number) => -n], // Always returns negative hash
      };
      const negativeFilter = new BloomFilter<number>(100, options);
      negativeFilter.add(42);
      expect(negativeFilter.contains(42)).to.be.true;
    });
  });

  describe('clear', () => {
    it('should reset the filter', () => {
      const filter = new BloomFilter<string>(100);
      filter.add('test1');
      filter.add('test2');
      expect(filter.count()).to.equal(2);
      expect(filter.contains('test1')).to.be.true;
      expect(filter.contains('test2')).to.be.true;

      filter.clear();
      expect(filter.count()).to.equal(0);
      // After clearing, previously added elements should not be found
      expect(filter.contains('test1')).to.be.false;
      expect(filter.contains('test2')).to.be.false;

      // Verify we can add elements again after clearing
      filter.add('test3');
      expect(filter.count()).to.equal(1);
      expect(filter.contains('test3')).to.be.true;
    });
  });

  describe('with funnel', () => {
    interface TestObject {
      id: number;
      name: string;
    }

    const funnel: Funnel<TestObject> = (obj: TestObject, sink: PrimitiveSink) => {
      sink.putNumber(obj.id).putString(obj.name);
    };

    it('should work with custom objects using a funnel', () => {
      const options: BloomFilterOptions<TestObject> = {
        funnel,
        hashFunctions: [Cyrb53HashFunction.instance()],
      };

      const filter = new BloomFilter<TestObject>(100, options);
      const obj1 = { id: 1, name: 'test1' };
      const obj2 = { id: 2, name: 'test2' };

      filter.add(obj1);
      filter.add(obj2);

      expect(filter.contains(obj1)).to.be.true;
      expect(filter.contains(obj2)).to.be.true;
      expect(filter.contains({ id: 3, name: 'test3' })).to.be.false;
    });
  });
});
