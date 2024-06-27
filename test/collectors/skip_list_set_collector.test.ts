import { expect } from 'chai';
import { SkipListSet, skipListSetCollector } from '../../src';

describe('SkipListCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new SkipListSet<number>();
    const collector = skipListSetCollector(col);
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = skipListSetCollector();
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('SkipListSet');
  });
});
