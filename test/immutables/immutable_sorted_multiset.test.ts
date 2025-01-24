import { expect } from 'chai';
import { AvlTreeMultiSet, ImmutableSortedMultiSet } from '../../src';

describe('ImmutableSortedMultiSet', () => {
  let baseSet: AvlTreeMultiSet<number>;
  let immutableSet: ImmutableSortedMultiSet<number>;

  beforeEach(() => {
    baseSet = new AvlTreeMultiSet<number>();
    [1, 1, 3, 3, 3, 5, 7, 7, 9].forEach(n => baseSet.add(n));
    immutableSet = new ImmutableSortedMultiSet(baseSet);
  });

  it('should provide immutable view of first element', () => {
    expect(immutableSet.first()).to.equal(1);
    baseSet.add(0);
    expect(immutableSet.first()).to.equal(0);
  });

  it('should provide immutable view of last element', () => {
    expect(immutableSet.last()).to.equal(9);
    baseSet.add(10);
    expect(immutableSet.last()).to.equal(10);
  });

  it('should provide immutable reverse iterator', () => {
    const values = Array.from(immutableSet.reverseIterator());
    expect(values).to.deep.equal([9, 7, 7, 5, 3, 3, 3, 1, 1]);

    baseSet.add(10);
    const updatedValues = Array.from(immutableSet.reverseIterator());
    expect(updatedValues).to.deep.equal([10, 9, 7, 7, 5, 3, 3, 3, 1, 1]);
  });

  it('should return same instance on clone', () => {
    const cloned = immutableSet.clone();
    expect(cloned).to.equal(immutableSet);
  });

  it('should reflect changes in underlying set', () => {
    baseSet.add(2);
    expect(Array.from(immutableSet)).to.deep.equal([1, 1, 2, 3, 3, 3, 5, 7, 7, 9]);

    baseSet.removeItem(3);
    expect(Array.from(immutableSet)).to.deep.equal([1, 1, 2, 3, 3, 5, 7, 7, 9]);
  });

  it('should provide accurate count of elements', () => {
    expect(immutableSet.count(1)).to.equal(2);
    expect(immutableSet.count(3)).to.equal(3);
    expect(immutableSet.count(7)).to.equal(2);
    expect(immutableSet.count(10)).to.equal(0);

    baseSet.add(1);
    expect(immutableSet.count(1)).to.equal(3);
  });

  it('should handle empty set operations', () => {
    const emptyBase = new AvlTreeMultiSet<number>();
    const emptyImmutable = new ImmutableSortedMultiSet(emptyBase);

    expect(emptyImmutable.first()).to.be.undefined;
    expect(emptyImmutable.last()).to.be.undefined;
    expect(Array.from(emptyImmutable.reverseIterator())).to.deep.equal([]);
    expect(emptyImmutable.count(1)).to.equal(0);
  });

  it('should maintain sorted order with duplicates when base set changes', () => {
    [8, 8, 2, 2, 4, 4, 6, 6].forEach(n => baseSet.add(n));
    expect([...immutableSet]).to.deep.equal([1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9]);
  });

  it('should return the first entry', () => {
    expect(immutableSet.firstEntry()).to.eql({ key: 1, count: 2 });
    baseSet.add(0);
    expect(immutableSet.firstEntry()).to.eql({ key: 0, count: 1 });
  });

  it('should return the last entry', () => {
    expect(immutableSet.lastEntry()).to.eql({ key: 9, count: 1 });
    baseSet.add(10);
    baseSet.add(10);
    expect(immutableSet.lastEntry()).to.eql({ key: 10, count: 2 });
  });

  it('should provide immutable reverse entry iterator', () => {
    expect([...immutableSet.reverseEntryIterator()]).to.deep.equal([
      { key: 9, count: 1 },
      { key: 7, count: 2 },
      { key: 5, count: 1 },
      { key: 3, count: 3 },
      { key: 1, count: 2 },
    ]);
  });
});
