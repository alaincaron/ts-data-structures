import { expect } from 'chai';
import { SingletonNavigableMultiSet } from '../../src';

describe('SingletonNavigableMultiSet', () => {
  let multiSet: SingletonNavigableMultiSet<number>;

  beforeEach(() => {
    multiSet = new SingletonNavigableMultiSet(5); // A simple set containing the number 5
  });

  it('should return the value for `lower()` when input is greater', () => {
    const result = multiSet.lower(10);
    expect(result).to.equal(5);
  });

  it('should return undefined for `lower()` when input is smaller or equal', () => {
    expect(multiSet.lower(5)).to.be.undefined;
    expect(multiSet.lower(3)).to.be.undefined;
  });

  it('should return an entry for `lowerEntry()` when input is greater', () => {
    const entry = multiSet.lowerEntry(10);
    expect(entry).to.deep.equal({ key: 5, count: 1 });
  });

  it('should return undefined for `lowerEntry()` when input is smaller or equal', () => {
    expect(multiSet.lowerEntry(5)).to.be.undefined;
    expect(multiSet.lowerEntry(2)).to.be.undefined;
  });

  it('should return the value for `higher()` when input is smaller', () => {
    const result = multiSet.higher(3);
    expect(result).to.equal(5);
  });

  it('should return undefined for `higher()` when input is greater or equal', () => {
    expect(multiSet.higher(5)).to.be.undefined;
    expect(multiSet.higher(10)).to.be.undefined;
  });

  it('should return an entry for `higherEntry()` when input is smaller', () => {
    const entry = multiSet.higherEntry(3);
    expect(entry).to.deep.equal({ key: 5, count: 1 });
  });

  it('should return undefined for `higherEntry()` when input is greater or equal', () => {
    expect(multiSet.higherEntry(5)).to.be.undefined;
    expect(multiSet.higherEntry(8)).to.be.undefined;
  });

  it('should return the value for `floor()` when input is greater or equal', () => {
    expect(multiSet.floor(5)).to.equal(5);
    expect(multiSet.floor(10)).to.equal(5);
  });

  it('should return undefined for `floor()` when input is smaller', () => {
    expect(multiSet.floor(3)).to.be.undefined;
  });

  it('should return an entry for `floorEntry()` when input is greater or equal', () => {
    const entry = multiSet.floorEntry(8);
    expect(entry).to.deep.equal({ key: 5, count: 1 });
  });

  it('should return undefined for `floorEntry()` when input is smaller', () => {
    expect(multiSet.floorEntry(1)).to.be.undefined;
  });

  it('should return the value for `ceiling()` when input is less than or equal', () => {
    expect(multiSet.ceiling(3)).to.equal(5);
    expect(multiSet.ceiling(5)).to.equal(5);
  });

  it('should return undefined for `ceiling()` when input is greater', () => {
    expect(multiSet.ceiling(8)).to.be.undefined;
  });

  it('should return an entry for `ceilingEntry()` when input is less or equal', () => {
    const entry = multiSet.ceilingEntry(4);
    expect(entry).to.deep.equal({ key: 5, count: 1 });
  });

  it('should return undefined for `ceilingEntry()` when input is greater', () => {
    expect(multiSet.ceilingEntry(9)).to.be.undefined;
  });

  it('should return the same instance for `clone()`', () => {
    const clone = multiSet.clone();
    expect(clone).to.equal(multiSet); // Ensure it's the same instance
  });
});
