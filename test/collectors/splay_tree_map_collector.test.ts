import { expect } from 'chai';
import { CollisionHandlers } from 'ts-fluent-iterators';
import { SplayTreeMap, splayTreeMapCollector } from '../../src';

describe('SplayTreeMapCollector', () => {
  it('should add items to the wrapped collection using default collision handler', () => {
    const collector = splayTreeMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(SplayTreeMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMap');
  });

  it('should add items to the built collection using the default collision handler', () => {
    const map = new SplayTreeMap();
    const collector = splayTreeMapCollector({ arg: map });
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(SplayTreeMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMap');
  });

  it('should throw on collision', () => {
    const collector = splayTreeMapCollector({ collisionHandler: CollisionHandlers.reject });
    collector.collect(['foo', 3]);
    expect(() => collector.collect(['foo', 6])).to.throw(Error);
    const result = collector.result;
    expect(result.equals(SplayTreeMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMap');
  });

  it('should keep previous on collision', () => {
    const collector = splayTreeMapCollector({ collisionHandler: CollisionHandlers.ignore });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(SplayTreeMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMap');
  });

  it('should overwrite previous value on collision', () => {
    const collector = splayTreeMapCollector({ collisionHandler: CollisionHandlers.overwrite });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(SplayTreeMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('SplayTreeMap');
  });
});
