import { expect } from 'chai';
import { createMultiMap } from './helper';
import { LinkedHashMultiMap, linkedHashMultiMapCollector } from '../../src';

describe('LinkedHashMultiMapCollector', () => {
  it('should add items to the wrapped collection', () => {
    const collector = linkedHashMultiMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(createMultiMap(['foo', 3], ['foo', 6]))).to.be.true;
    expect(result.constructor.name).equals('LinkedHashMultiMap');
  });

  it('should add items to the built collection using', () => {
    const map = new LinkedHashMultiMap();
    const collector = linkedHashMultiMapCollector(map);
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(createMultiMap(['foo', 6], ['foo', 3]))).to.be.true;
    expect(result.constructor.name).equals('LinkedHashMultiMap');
  });
});
