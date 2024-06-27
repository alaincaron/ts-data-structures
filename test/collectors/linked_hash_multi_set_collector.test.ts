import { expect } from 'chai';
import { LinkedHashMultiSet, linkedHashMultiSetCollector } from '../../src';

describe('LinkedHashMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = linkedHashMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(LinkedHashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('LinkedHashMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new LinkedHashMultiSet();
    const collector = linkedHashMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(LinkedHashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
