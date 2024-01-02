import { expect } from 'chai';
import { HashMap, IMapCollector, openHashMapCollector } from '../../src';

describe('Collectors', () => {
  it('should add items to the wrapped collection', () => {
    const collector = openHashMapCollector();
    collector.collect(['foobar', 6]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foobar', 6) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should add items to the built collection', () => {
    const collector = new IMapCollector(HashMap);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });
});
