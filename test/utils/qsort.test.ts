import { expect } from 'chai';
import { median, qsort } from '../../src';

describe('qsort', () => {
  it('should sorted array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered()).to.be.false;
    qsort(a);
    expect(a.isStrictlyOrdered()).to.be.true;
  });
  it('should sorted array range', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    a.shuffle();
    expect(a.isOrdered(0, 100)).to.be.false;
    qsort(a, 0, 100);
    expect(a.isStrictlyOrdered(0, 100)).to.be.true;
    a.shuffle();
    qsort(a, 20, 30);
    expect(a.isStrictlyOrdered(20, 30)).to.be.true;
  });
});

describe('median', () => {
  it('should return the median element of an even size array', () => {
    const a = Array.from({ length: 250 }, (_, i) => i);
    expect(median(a)).to.equal(125);
    a.shuffle();
    expect(median(a)).to.equal(125);
  });
  it('should return the median element of an odd size array', () => {
    const a = Array.from({ length: 251 }, (_, i) => i);
    expect(median(a)).to.equal(125);
    a.shuffle();
    expect(median(a)).to.equal(125);
  });
});
