import { expect } from 'chai';
import { Immutable } from '../../src/immutables';
import { ArrayList } from '../../src/lists';

describe('Immutable', () => {
  describe('emptyList', () => {
    it('should return an empty immutable list', () => {
      const list = Immutable.emptyList();
      expect(list.size()).to.equal(0);
    });

    it('should always return the same instance', () => {
      const list1 = Immutable.emptyList();
      const list2 = Immutable.emptyList();
      expect(list1).to.equal(list2);
    });
  });

  describe('singletonList', () => {
    it('should create an immutable list with one element', () => {
      const list = Immutable.singletonList(42);
      expect(list.size()).to.equal(1);
      expect(list.getAt(0)).to.equal(42);
    });
  });

  describe('listOf', () => {
    it('should create an immutable list from given elements', () => {
      const list = Immutable.listOf(1, 2, 3);
      expect(list.size()).to.equal(3);
      expect(list.toArray()).to.deep.equal([1, 2, 3]);
    });

    it('should return empty list when no elements provided', () => {
      const list = Immutable.listOf();
      expect(list.size()).to.equal(0);
      expect(list).to.equal(Immutable.emptyList());
    });
  });

  describe('asReadOnlyCollection', () => {
    it('should return an immutable view of a collection', () => {
      const list = ArrayList.create({ initial: [1, 2, 3] });
      const immutable = Immutable.asReadOnlyCollection(list);
      expect(immutable.size()).to.equal(3);
      list.add(4);
      expect(immutable.size()).to.equal(4);
    });

    it('should return the same instance if already immutable', () => {
      const immutable1 = Immutable.listOf(1, 2, 3);
      const immutable2 = Immutable.asReadOnlyCollection(immutable1);
      expect(immutable1).to.equal(immutable2);
    });
  });

  describe('setOf', () => {
    it('should create an immutable set from given elements', () => {
      const set = Immutable.setOf(1, 2, 3);
      expect(set.size()).to.equal(3);
      expect(set.contains(2)).to.equal(true);
    });

    it('should return empty set when no elements provided', () => {
      const set = Immutable.setOf();
      expect(set.size()).to.equal(0);
      expect(set).to.equal(Immutable.emptySet());
    });
  });

  describe('multiSetOf', () => {
    it('should create an immutable multiset from given elements', () => {
      const multiset = Immutable.multiSetOf(1, 1, 2, 3, 3);
      expect(multiset.size()).to.equal(5);
      expect(multiset.count(1)).to.equal(2);
      expect(multiset.count(3)).to.equal(2);
    });

    it('should return empty multiset when no elements provided', () => {
      const multiset = Immutable.multiSetOf();
      expect(multiset.size()).to.equal(0);
      expect(multiset).to.equal(Immutable.emptyMultiSet());
    });
  });
});
