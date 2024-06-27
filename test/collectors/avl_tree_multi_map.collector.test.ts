import { expect } from 'chai';
import { createMultiMap } from './helper';
import { AvlTreeMultiMap, avlTreeMultiMapCollector } from '../../src';

describe('avlTreeMultiMapCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = avlTreeMultiMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(createMultiMap(['foo', 3], ['foo', 6]))).to.be.true;
    expect(result.constructor.name).equals('AvlTreeMultiMap');
  });

  it('should add items to the built collection using', () => {
    const map = new AvlTreeMultiMap();
    const collector = avlTreeMultiMapCollector(map);
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(createMultiMap(['foo', 6], ['foo', 3]))).to.be.true;
    expect(result.constructor.name).equals('AvlTreeMultiMap');
  });
});
