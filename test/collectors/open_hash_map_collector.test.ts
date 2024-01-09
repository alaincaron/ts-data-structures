import { expect } from 'chai';
import { Functions } from 'ts-fluent-iterators';
import { HashMap, OpenHashMap, openHashMapCollector } from '../../src';

describe('OpenHashMapCollector', () => {
  it('should add items to the wrapped collection using default collision handler', () => {
    const collector = openHashMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should add items to the built collection using the default collision handler', () => {
    const map = new OpenHashMap();
    const collector = openHashMapCollector({ arg: map });
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should throw on collision', () => {
    const map = new OpenHashMap();
    const collector = openHashMapCollector({ arg: map, collisionHandler: Functions.CollisionHandlers.reject });
    collector.collect(['foo', 3]);
    expect(() => collector.collect(['foo', 6])).to.throw(Error);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should keep previous on collision', () => {
    const collector = openHashMapCollector({ collisionHandler: Functions.CollisionHandlers.ignore });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });

  it('should overwrite previous value on collision', () => {
    const collector = openHashMapCollector({ collisionHandler: Functions.CollisionHandlers.overwrite });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('OpenHashMap');
  });
});
