import { expect } from 'chai';
import { bsearch } from '../../src';

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

  it('should use the provided mapper', () => {
    const a = Array.from({ length: 100 }, (_, i) => ({ value: i, data: i.toString() }));
    expect(a.bsearch(10, { mapper: x => x.value })).equal(10);
    expect(~a.bsearch(10.5, { mapper: x => x.value })).equal(11);
  });
});

describe('insertSorted', () => {
  it('should insert elements at the right position', () => {
    const a = Array.from({ length: 100 }, (_, i) => i);
    expect(a.insertSorted(-1).isStrictlyOrdered()).to.be.true;
    expect(a.insertSorted(101).isStrictlyOrdered()).to.be.true;
    expect(a.insertSorted(55.4).isStrictlyOrdered()).to.be.true;
    expect(a.length).equal(103);
  });
});
