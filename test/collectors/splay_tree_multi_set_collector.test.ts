import { expect } from 'chai';
import { SplayTreeMultiSet, splayTreeMultiSetCollector } from '../../src';

describe('SplayTreeMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = splayTreeMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(SplayTreeMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new SplayTreeMultiSet();
    const collector = splayTreeMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(SplayTreeMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
