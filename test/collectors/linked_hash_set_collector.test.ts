import { expect } from 'chai';
import { LinkedHashSet, linkedHashSetCollector } from '../../src';

describe('LinkedHashSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new LinkedHashSet<number>();
    const collector = linkedHashSetCollector(col);
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = linkedHashSetCollector();
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('LinkedHashSet');
  });
});
