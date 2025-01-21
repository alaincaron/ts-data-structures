import { expect } from 'chai';
import { SingletonList } from '../../src/immutables/singletonList';
import { SingletonMultiSet } from '../../src/immutables/singletonMultiSet';
import { SingletonSet } from '../../src/immutables/singletonSet';

describe('Singleton Collections', () => {
  describe('SingletonList', () => {
    it('should create list with single element', () => {
      const list = new SingletonList(42);
      expect(list.size()).to.equal(1);
      expect(list.getAt(0)).to.equal(42);
    });

    it('should throw on invalid index', () => {
      const list = new SingletonList(42);
      expect(() => list.getAt(-1)).to.throw();
      expect(() => list.getAt(1)).to.throw();
    });

    it('should contain only the singleton element', () => {
      const list = new SingletonList(42);
      expect(list.contains(42)).to.equal(true);
      expect(list.contains(1)).to.equal(false);
    });

    it('should iterate over single element', () => {
      const list = new SingletonList(42);
      const iterator = list.iterator();
      const result = iterator.next();
      expect(result.done).to.equal(false);
      expect(result.value).to.equal(42);
      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('SingletonSet', () => {
    it('should create set with single element', () => {
      const set = new SingletonSet(42);
      expect(set.size()).to.equal(1);
      expect(set.contains(42)).to.equal(true);
    });

    it('should contain only the singleton element', () => {
      const set = new SingletonSet(42);
      expect(set.contains(42)).to.equal(true);
      expect(set.contains(1)).to.equal(false);
    });

    it('should iterate over single element', () => {
      const set = new SingletonSet(42);
      const iterator = set.iterator();
      const result = iterator.next();
      expect(result.done).to.equal(false);
      expect(result.value).to.equal(42);
      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('SingletonMultiSet', () => {
    it('should create multiset with single element', () => {
      const multiset = new SingletonMultiSet(42);
      expect(multiset.size()).to.equal(1);
      expect(multiset.contains(42)).to.equal(true);
    });

    it('should have correct count for elements', () => {
      const multiset = new SingletonMultiSet(42);
      expect(multiset.count(42)).to.equal(1);
      expect(multiset.count(1)).to.equal(0);
    });

    it('should contain only the singleton element', () => {
      const multiset = new SingletonMultiSet(42);
      expect(multiset.contains(42)).to.equal(true);
      expect(multiset.contains(1)).to.equal(false);
    });

    it('should iterate over single element', () => {
      const multiset = new SingletonMultiSet(42);
      const iterator = multiset.iterator();
      const result = iterator.next();
      expect(result.done).to.equal(false);
      expect(result.value).to.equal(42);
      expect(iterator.next().done).to.equal(true);
    });
  });
});
