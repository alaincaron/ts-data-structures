import { expect } from 'chai';
import { SkipListMultiSet, skipListMultiSetCollector } from '../../src';

describe('SkipListMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = skipListMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(SkipListMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('SkipListMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new SkipListMultiSet();
    const collector = skipListMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(SkipListMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
