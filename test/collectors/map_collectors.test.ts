import { expect } from 'chai';
import { HashMap, IMapCollector, openHashMapCollector } from '../../src';

describe('Collectors', () => {
  it('should add items to the wrapped collection', () => {
    const collector = openHashMapCollector((s: string) => s.length);
    collector.collect('foobar');
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set(6, 'foobar') }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should add items to the built collection', () => {
    const collector = new IMapCollector((s: string) => s.length, HashMap);
    collector.collect('foo');
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set(3, 'foo') }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });
});
