import { expect } from 'chai';
import { AvlTreeMultiSet, avlTreeMultiSetCollector } from '../../src';

describe('AvlTreeMultiSetCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = avlTreeMultiSetCollector();
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(AvlTreeMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
    expect(result.constructor.name).equals('AvlTreeMultiSet');
  });

  it('should add items to the built collection using', () => {
    const multiset = new AvlTreeMultiSet();
    const collector = avlTreeMultiSetCollector(multiset);
    collector.collect('bar');
    collector.collect('foo');
    collector.collect('foo');
    const result = collector.result;
    expect(result).to.equal(multiset);
    expect(result.equals(AvlTreeMultiSet.create({ initial: ['foo', 'foo', 'bar'] }))).to.be.true;
  });
});
