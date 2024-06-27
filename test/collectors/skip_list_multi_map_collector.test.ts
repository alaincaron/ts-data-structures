import { expect } from 'chai';
import { createMultiMap } from './helper';
import { SkipListMultiMap, skipListMultiMapCollector } from '../../src';

describe('avlTreeMultiMapCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = skipListMultiMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(createMultiMap(['foo', 3], ['foo', 6]))).to.be.true;
    expect(result.constructor.name).equals('SkipListMultiMap');
  });

  it('should add items to the built collection using', () => {
    const map = new SkipListMultiMap();
    const collector = skipListMultiMapCollector(map);
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(createMultiMap(['foo', 6], ['foo', 3]))).to.be.true;
    expect(result.constructor.name).equals('SkipListMultiMap');
  });
});
