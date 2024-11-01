import { expect } from 'chai';
import { shellSort } from '../../src';

describe('shellSort', () => {
  it('should sorted array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered()).to.be.false;
    shellSort(a);
    expect(a.isStrictlyOrdered()).to.be.true;
  });
  it('should sorted array range', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered(0, 100)).to.be.false;
    shellSort(a, 0, 100);
    expect(a.isStrictlyOrdered(0, 100)).to.be.true;
    a.shuffle();
    shellSort(a, 20, 30);
    expect(a.isStrictlyOrdered(20, 30)).to.be.true;
  });
});
