import { expect } from 'chai';
import { LinkedList, linkedListCollector } from '../../src';

describe('LinkedListCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new LinkedList<number>();
    const collector = linkedListCollector(col);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = linkedListCollector();
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('LinkedList');
  });
});
