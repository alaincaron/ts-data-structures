import { expect } from 'chai';
import { EmptyList } from '../../src/immutables/emptyList';
import { EmptyMultiSet } from '../../src/immutables/emptyMultiSet';
import { EmptySet } from '../../src/immutables/emptySet';
import { List } from '../../src/lists';
import { NavigableMultiSet } from '../../src/multisets';
import { NavigableSet } from '../../src/sets';

describe('Empty Collections', () => {
  describe('EmptyList', () => {
    let emptyList: List<number>;

    beforeEach(() => {
      emptyList = EmptyList.instance();
    });

    it('should always return the same instance', () => {
      expect(EmptyList.instance()).to.equal(EmptyList.instance());
    });

    it('should have size 0', () => {
      expect(emptyList.size()).to.equal(0);
    });

    it('should be empty', () => {
      expect(emptyList.isEmpty()).to.equal(true);
    });

    it('should not contain any element', () => {
      expect(emptyList.contains(1)).to.equal(false);
    });

    it('should return empty iterator', () => {
      const iterator = emptyList.iterator();
      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('EmptySet', () => {
    let emptySet: NavigableSet<number>;

    beforeEach(() => {
      emptySet = EmptySet.instance();
    });

    it('should always return the same instance', () => {
      expect(EmptySet.instance()).to.equal(EmptySet.instance());
    });

    it('should have size 0', () => {
      expect(emptySet.size()).to.equal(0);
    });

    it('should be empty', () => {
      expect(emptySet.isEmpty()).to.equal(true);
    });

    it('should not contain any element', () => {
      expect(emptySet.contains(1)).to.equal(false);
    });

    it('should return empty iterator', () => {
      const iterator = emptySet.iterator();
      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('EmptyMultiSet', () => {
    let emptyMultiSet: NavigableMultiSet<number>;

    beforeEach(() => {
      emptyMultiSet = EmptyMultiSet.instance();
    });

    it('should always return the same instance', () => {
      expect(EmptyMultiSet.instance()).to.equal(EmptyMultiSet.instance());
    });

    it('should have size 0', () => {
      expect(emptyMultiSet.size()).to.equal(0);
    });

    it('should be empty', () => {
      expect(emptyMultiSet.isEmpty()).to.equal(true);
    });

    it('should not contain any element', () => {
      expect(emptyMultiSet.contains(1)).to.equal(false);
    });

    it('should have count 0 for any element', () => {
      expect(emptyMultiSet.count(1)).to.equal(0);
    });

    it('should return empty iterator', () => {
      const iterator = emptyMultiSet.iterator();
      expect(iterator.next().done).to.equal(true);
    });
  });
});
