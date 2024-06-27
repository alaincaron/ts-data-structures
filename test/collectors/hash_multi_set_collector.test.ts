import { expect } from 'chai';
import { HashMultiSet, hashMultiSetCollector } from '../../src';

describe('HashMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = hashMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(HashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('HashMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new HashMultiSet();
    const collector = hashMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(HashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
