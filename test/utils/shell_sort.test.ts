import { expect } from 'chai';
import { isOrdered, shellSort } from '../../src';

describe('shellSort', () => {
  it('should sorted array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(isOrdered(a)).to.be.false;
    shellSort(a);
    expect(isOrdered(a)).to.be.true;
  });
  it('should sorted array range', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(isOrdered(a, 0, 100)).to.be.false;
    shellSort(a, 0, 100);
    expect(isOrdered(a, 0, 100)).to.be.true;
    a.shuffle();
    shellSort(a, 20, 30);
    expect(isOrdered(a, 20, 30)).to.be.true;
  });
});
