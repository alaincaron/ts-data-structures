import { expect } from 'chai';
import { PriorityQueue, priorityQueueCollector } from '../../src';

describe('PriorityQueueCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new PriorityQueue<number>();
    const collector = priorityQueueCollector(col);
    collector.collect(25);
    collector.collect(12);
    const result = collector.result;
    expect(result.toArray()).deep.equal([12, 25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = priorityQueueCollector();
    collector.collect(25);
    collector.collect(12);
    const result = collector.result;
    expect(result.toArray()).deep.equal([12, 25]);
    expect(result.constructor.name).equals('PriorityQueue');
  });
});
