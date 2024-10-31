import { expect } from 'chai';
import { lastNCollector, topKCollector } from '../../src';

describe('lastNCollector', () => {
  it('should keep all elements', () => {
    const collector = lastNCollector<number>(10);
    collector.collect(1);
    collector.collect(2);
    expect(collector.result.collect()).deep.equal([1, 2]);
  });
  it('should keep only last 2 elements', () => {
    const collector = lastNCollector<number>(2);
    for (let i = 1; i <= 5; ++i) collector.collect(i);
    expect(collector.result.collect()).deep.equal([4, 5]);
  });
});

describe('topKCollector', () => {
  it('should keep all elements', () => {
    const collector = topKCollector<number>(10);
    [1, 2, 3].shuffle().forEach(x => collector.collect(x));
    expect(collector.result.collect()).deep.equal([1, 2, 3]);
  });
  it('should keep only last 2 elements', () => {
    const collector = topKCollector<number>(3);
    Array.from({ length: 10 }, (_, i) => i)
      .shuffle()
      .forEach(x => collector.collect(x));

    expect(collector.result.collect()).deep.equal([7, 8, 9]);
  });
});
