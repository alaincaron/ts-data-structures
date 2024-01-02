import { expect } from 'chai';
import { HashSet, hashSetCollector } from '../../src';

describe('HashSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new HashSet<number>();
    const collector = hashSetCollector(col);
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = hashSetCollector();
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('HashSet');
  });
});
