import { expect } from 'chai';
import { AvlTreeSet, avlTreeSetCollector } from '../../src';

describe('AvlTreeCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new AvlTreeSet<number>();
    const collector = avlTreeSetCollector(col);
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = avlTreeSetCollector();
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('AvlTreeSet');
  });
});
