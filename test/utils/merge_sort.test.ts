import { expect } from 'chai';
import { mergeSort } from '../../src';

describe('mergeSort', () => {
  it('should sorted array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered()).to.be.false;
    mergeSort(a);
    expect(a.isStrictlyOrdered()).to.be.true;
  });
  it('should sorted array range', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered(0, 100)).to.be.false;
    mergeSort(a, 0, 100);
    expect(a.isOrdered(0, 100)).to.be.true;
    a.shuffle();
    mergeSort(a, 20, 30);
    expect(a.isOrdered(20, 30)).to.be.true;
  });
});
