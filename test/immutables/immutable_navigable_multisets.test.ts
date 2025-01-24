import { expect } from 'chai';
import { AvlTreeMultiSet, ImmutableNavigableMultiSet } from '../../src';

describe('ImmutableNavigableMultiSet', () => {
  let baseSet: AvlTreeMultiSet<number>;
  let immutableSet: ImmutableNavigableMultiSet<number>;

  beforeEach(() => {
    baseSet = AvlTreeMultiSet.create({ initial: [1, 1, 3, 3, 3, 5, 7, 7, 9] });
    immutableSet = new ImmutableNavigableMultiSet(baseSet);
  });

  it('should find floor element', () => {
    expect(immutableSet.floor(6)).to.equal(5);
    expect(immutableSet.floor(5)).to.equal(5);
    expect(immutableSet.floor(0)).to.be.undefined;

    baseSet.add(4);
    expect(immutableSet.floor(6)).to.equal(5);
    expect(immutableSet.floor(4.5)).to.equal(4);
  });

  it('should find ceiling element', () => {
    expect(immutableSet.ceiling(6)).to.equal(7);
    expect(immutableSet.ceiling(7)).to.equal(7);
    expect(immutableSet.ceiling(10)).to.be.undefined;

    baseSet.add(6);
    expect(immutableSet.ceiling(5.5)).to.equal(6);
    expect(immutableSet.ceiling(6)).to.equal(6);
  });

  it('should find lower element', () => {
    expect(immutableSet.lower(5)).to.equal(3);
    expect(immutableSet.lower(6)).to.equal(5);
    expect(immutableSet.lower(1)).to.be.undefined;

    baseSet.add(4);
    expect(immutableSet.lower(5)).to.equal(4);
    expect(immutableSet.lower(4)).to.equal(3);
  });

  it('should find higher element', () => {
    expect(immutableSet.higher(5)).to.equal(7);
    expect(immutableSet.higher(6)).to.equal(7);
    expect(immutableSet.higher(9)).to.be.undefined;

    baseSet.add(6);
    expect(immutableSet.higher(5)).to.equal(6);
    expect(immutableSet.higher(6)).to.equal(7);
  });

  it('should inherit sorted multiset functionality', () => {
    expect(immutableSet.first()).to.equal(1);
    expect(immutableSet.last()).to.equal(9);
    expect(Array.from(immutableSet.reverseIterator())).to.deep.equal([9, 7, 7, 5, 3, 3, 3, 1, 1]);
    expect(immutableSet.count(3)).to.equal(3);
  });

  it('should maintain accurate counts', () => {
    expect(immutableSet.count(1)).to.equal(2);
    expect(immutableSet.count(3)).to.equal(3);
    expect(immutableSet.count(7)).to.equal(2);
    expect(immutableSet.size()).to.equal(9); // All elements including duplicates

    baseSet.add(1);
    expect(immutableSet.count(1)).to.equal(3);
    expect(immutableSet.size()).to.equal(10);
  });

  it('should handle boundary cases', () => {
    expect(immutableSet.floor(Number.NEGATIVE_INFINITY)).to.be.undefined;
    expect(immutableSet.ceiling(Number.NEGATIVE_INFINITY)).to.equal(1);
    expect(immutableSet.floor(Number.POSITIVE_INFINITY)).to.equal(9);
    expect(immutableSet.ceiling(Number.POSITIVE_INFINITY)).to.be.undefined;
  });

  it('should handle empty set operations', () => {
    const emptyBase = new AvlTreeMultiSet<number>();
    const emptyImmutable = new ImmutableNavigableMultiSet(emptyBase);

    expect(emptyImmutable.floor(5)).to.be.undefined;
    expect(emptyImmutable.ceiling(5)).to.be.undefined;
    expect(emptyImmutable.lower(5)).to.be.undefined;
    expect(emptyImmutable.higher(5)).to.be.undefined;
    expect(emptyImmutable.count(5)).to.equal(0);
  });

  it('should inherit sorted multiset functionality', () => {
    expect(immutableSet.first()).to.equal(1);
    expect(immutableSet.last()).to.equal(9);
    expect(Array.from(immutableSet.reverseIterator())).to.deep.equal([9, 7, 7, 5, 3, 3, 3, 1, 1]);
    expect(immutableSet.count(3)).to.equal(3);
  });

  it('should handle changes in base set with duplicates', () => {
    baseSet.add(2);
    baseSet.add(2);
    baseSet.add(4);
    baseSet.add(4);
    baseSet.add(6);
    baseSet.add(6);
    baseSet.add(8);
    baseSet.add(8);

    expect(immutableSet.lower(5)).to.equal(4);
    expect(immutableSet.floor(5)).to.equal(5);
    expect(immutableSet.ceiling(5)).to.equal(5);
    expect(immutableSet.higher(5)).to.equal(6);
    expect(immutableSet.count(4)).to.equal(2);
    expect(immutableSet.count(6)).to.equal(2);

    baseSet.removeItem(5);

    expect(immutableSet.lower(5)).to.equal(4);
    expect(immutableSet.floor(5)).to.equal(4);
    expect(immutableSet.ceiling(5)).to.equal(6);
    expect(immutableSet.higher(5)).to.equal(6);
  });

  it('should maintain counts when modifying base set', () => {
    expect(immutableSet.count(3)).to.equal(3);
    baseSet.add(3);
    expect(immutableSet.count(3)).to.equal(4);
    baseSet.removeItem(3);
    expect(immutableSet.count(3)).to.equal(3);
    baseSet.removeItem(3);
    expect(immutableSet.count(3)).to.equal(2);
  });

  it('should return the lower entry', () => {
    expect(immutableSet.lowerEntry(5)).to.eql({ key: 3, count: 3 });
    expect(immutableSet.lowerEntry(6)).to.eql({ key: 5, count: 1 });
    expect(immutableSet.lower(1)).to.be.undefined;

    baseSet.add(4);
    expect(immutableSet.lowerEntry(5)).to.eql({ key: 4, count: 1 });
    expect(immutableSet.lowerEntry(4)).to.eql({ key: 3, count: 3 });
  });

  it('should find floor entry', () => {
    expect(immutableSet.floorEntry(6)).to.eql({ key: 5, count: 1 });
    expect(immutableSet.floorEntry(5)).to.eql({ key: 5, count: 1 });
    expect(immutableSet.floorEntry(0)).to.be.undefined;

    baseSet.add(4);
    expect(immutableSet.floorEntry(6)).to.eql({ key: 5, count: 1 });
    expect(immutableSet.floorEntry(4.5)).to.eql({ key: 4, count: 1 });
  });

  it('should find ceiling entry', () => {
    expect(immutableSet.ceilingEntry(6)).to.eql({ key: 7, count: 2 });
    expect(immutableSet.ceilingEntry(7)).to.eql({ key: 7, count: 2 });
    expect(immutableSet.ceilingEntry(10)).to.be.undefined;

    baseSet.add(6);
    expect(immutableSet.ceilingEntry(5.5)).to.eql({ key: 6, count: 1 });
    expect(immutableSet.ceilingEntry(6)).to.eql({ key: 6, count: 1 });
  });

  it('should find lower entry', () => {
    expect(immutableSet.lowerEntry(5)).to.eql({ key: 3, count: 3 });
    expect(immutableSet.lowerEntry(6)).to.eql({ key: 5, count: 1 });
    expect(immutableSet.lowerEntry(1)).to.be.undefined;

    baseSet.add(4);
    expect(immutableSet.lowerEntry(5)).to.eql({ key: 4, count: 1 });
    expect(immutableSet.lowerEntry(4)).to.eql({ key: 3, count: 3 });
  });

  it('should find higher entry', () => {
    expect(immutableSet.higherEntry(5)).to.eql({ key: 7, count: 2 });
    expect(immutableSet.higherEntry(6)).to.eql({ key: 7, count: 2 });
    expect(immutableSet.higherEntry(9)).to.be.undefined;

    baseSet.add(6);
    expect(immutableSet.higherEntry(5)).to.eql({ key: 6, count: 1 });
    expect(immutableSet.higherEntry(6)).to.eql({ key: 7, count: 2 });
  });
});
