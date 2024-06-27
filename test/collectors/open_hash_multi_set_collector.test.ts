import { expect } from 'chai';
import { OpenHashMultiSet, openHashMultiSetCollector } from '../../src';

describe('OpenHashMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = openHashMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(OpenHashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new OpenHashMultiSet();
    const collector = openHashMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(OpenHashMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
