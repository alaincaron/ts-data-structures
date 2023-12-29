import { expect } from 'chai';
import { ArraySet, HashSet, OpenHashSet } from '../../src';

describe('set-equals', () => {
  it('should return true for same object', () => {
    const a = new HashSet();
    expect(a.equals(a)).to.be.true;
  });

  it('should compare for cloned list', () => {
    const a = HashSet.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = a.clone();
    expect(a.equals(b)).to.be.true;
    expect(a.hashCode()).equals(b.hashCode());
    b.clear();
    expect(a.equals(b)).to.be.false;
  });

  it('should compare sets of different classes ', () => {
    const a = HashSet.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = OpenHashSet.create({ initial: a });
    expect(a.equals(b)).to.be.true;
    expect(b.equals(a)).to.be.true;
    expect(a.hashCode()).equals(b.hashCode());
    b.clear();
    expect(a.equals(b)).to.be.false;
    expect(b.equals(a)).to.be.false;
  });

  it('should compare sets even if iteration order is different', () => {
    const a = ArraySet.create({ initial: [1, 'foo', true] });
    const b = ArraySet.create({ initial: [true, 1, 'foo'] });
    expect(a.equals(b)).to.be.true;
    expect(b.equals(a)).to.be.true;
    expect(a.hashCode()).equals(b.hashCode());
  });
});
