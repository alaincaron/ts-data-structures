import { expect } from 'chai';
import { Collection } from '../../src/collections';
import { EmptyList } from '../../src/immutables/emptyList';
import { EmptyMultiSet } from '../../src/immutables/emptyMultiSet';
import { EmptySet } from '../../src/immutables/emptySet';
import { hashAny } from '../../src/utils';

function testCollectionMethods<C extends Collection<unknown>>(factory: () => C): C {
  const emptyCol = factory();

  it('should always return the same instance', () => {
    expect(factory()).to.equal(emptyCol);
    expect(emptyCol.clone()).eq(emptyCol);
    expect(emptyCol.toReadOnly()).eq(emptyCol);
    expect(emptyCol.asReadOnly()).eq(emptyCol);
  });

  it('should have have size and capacity be 0', () => {
    expect(emptyCol.size()).to.equal(0);
    expect(emptyCol.capacity()).to.equal(0);
    expect(emptyCol.isEmpty()).to.be.true;
    expect(emptyCol.isFull()).to.be.true;
    expect(emptyCol.remaining()).equal(0);
  });

  it('should not contain any element', () => {
    expect(emptyCol.contains(1)).to.equal(false);
  });

  it('should return empty iterator', () => {
    const iterator = emptyCol.iterator();
    expect(iterator.next().done).to.equal(true);
  });

  it('should not include any element', () => {
    expect(emptyCol.includes(42)).to.be.false;
  });

  it('should return empty array', () => {
    expect(emptyCol.toArray()).deep.equal([]);
  });

  it('should not find any item', () => {
    expect(emptyCol.find(_ => true)).to.be.undefined;
  });

  it('should have containsAll return true on empty collection, false otherwise', () => {
    expect(emptyCol.containsAll(emptyCol)).to.be.true;
    expect(emptyCol.containsAll([1])).to.be.false;
  });

  it('should have disjoint return true', () => {
    expect(emptyCol.disjoint(emptyCol)).to.be.true;
    expect(emptyCol.disjoint([1])).to.be.true;
  });

  it('should return the same hash code as an empty array', () => {
    expect(emptyCol.hashCode()).equal(hashAny([]));
  });

  it('should return an empty JSON array', () => {
    expect(emptyCol.toJSON()).equal('[]');
  });
  return emptyCol;
}

describe('Empty Collections', () => {
  describe('EmptyList', () => {
    testCollectionMethods(EmptyList.instance);
  });

  describe('EmptySet', () => {
    testCollectionMethods(EmptySet.instance);
  });

  describe('EmptyMultiSet', () => {
    const emptyMultiSet = testCollectionMethods(EmptyMultiSet.instance);

    it('should have count 0 for any element', () => {
      expect(emptyMultiSet.count(1)).to.equal(0);
    });
  });
});
