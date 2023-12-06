import { expect } from 'chai';
import { HashSet, OpenHashSet } from '../src';

describe('set-equals', () => {
  it('should return true for same object', () => {
    const a = new HashSet();
    expect(a.equals(a)).to.be.true;
  });

  it('should compare for cloned list', () => {
    const a = HashSet.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = a.clone();
    expect(a.equals(b)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
  });

  it('should compare sets of different classes ', () => {
    const a = HashSet.create({ initial: [1, 'foo', true, 2n, { x: 5 }, [1, 2]] });
    const b = OpenHashSet.create({ initial: a });
    expect(a.equals(b)).to.be.true;
    expect(b.equals(a)).to.be.true;
    b.clear();
    expect(a.equals(b)).to.be.false;
    expect(b.equals(a)).to.be.false;
  });
});
