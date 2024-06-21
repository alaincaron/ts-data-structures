import { expect } from 'chai';
import { bsearch, insertSorted, isStrictlyOrdered } from '../../src';

describe('bsearch', () => {
  it('should return the index for a match', () => {
    const a = Array.from({ length: 100 }, (_, i) => i);
    for (const v of a) {
      expect(bsearch(a, v)).equal(v);
    }
  });
  it('should return insert position for no match', () => {
    const a = Array.from({ length: 100 }, (_, i) => i);
    expect(~a.bsearch(-1)).equal(0);
    for (const v of a) {
      expect(~a.bsearch(v + 0.5)).equal(v + 1);
    }
  });
});

describe('insertSorted', () => {
  it('should insert elements at the right position', () => {
    const a = Array.from({ length: 100 }, (_, i) => i);
    expect(isStrictlyOrdered(insertSorted(a, -1))).to.be.true;
    expect(isStrictlyOrdered(insertSorted(a, 101))).to.be.true;
    expect(a.insertSorted(55.4).isStrictlyOrdered()).to.be.true;
    expect(a.length).equal(103);
  });
});
