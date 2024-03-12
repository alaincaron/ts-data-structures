import { expect } from 'chai';
import { lastN } from '../../src';

describe('lastN', () => {
  it('should keep all elements', () => {
    const collector = lastN<number>(10);
    collector.collect(1);
    collector.collect(2);
    expect(collector.result.collect()).deep.equal([1, 2]);
  });
  it('should keep only last 2 elements', () => {
    const collector = lastN<number>(2);
    for (let i = 1; i <= 5; ++i) collector.collect(i);
    expect(collector.result.collect()).deep.equal([4, 5]);
  });
});
