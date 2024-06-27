import { expect } from 'chai';
import { SplayTreeSet, splayTreeSetCollector } from '../../src';

describe('splayTreeCollector', () => {
  it('should add items to the wrapped collection', () => {
    const col = new SplayTreeSet<number>();
    const collector = splayTreeSetCollector(col);
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result).equal(col);
  });
  it('should add items to the built collection', () => {
    const collector = splayTreeSetCollector();
    collector.collect(25);
    collector.collect(25);
    const result = collector.result;
    expect(result.toArray()).deep.equal([25]);
    expect(result.constructor.name).equals('SplayTreeSet');
  });
});
