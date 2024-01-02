import { expect } from 'chai';
import { Functions } from 'ts-fluent-iterators';
import { HashMap, hashMapCollector } from '../../src';

describe('HashMapCollector', () => {
  it('should add items to the wrapped collection using default collision handler', () => {
    const collector = hashMapCollector();
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });

  it('should add items to the built collection using the default collision handler', () => {
    const map = new HashMap();
    const collector = hashMapCollector({ map });
    collector.collect(['foo', 6]);
    collector.collect(['foo', 3]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });

  it('should throw on collision', () => {
    const map = new HashMap();
    const collector = hashMapCollector({ map, collisionHandler: Functions.CollisionHandlers.reject });
    collector.collect(['foo', 3]);
    expect(() => collector.collect(['foo', 6])).to.throw(Error);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });

  it('should keep previous on collision', () => {
    const map = new HashMap();
    const collector = hashMapCollector({ map, collisionHandler: Functions.CollisionHandlers.ignore });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 3) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });

  it('should overwrite previous value on collision', () => {
    const map = new HashMap();
    const collector = hashMapCollector({ map, collisionHandler: Functions.CollisionHandlers.overwrite });
    collector.collect(['foo', 3]);
    collector.collect(['foo', 6]);
    const result = collector.result;
    expect(result).to.equal(map);
    expect(result.equals(HashMap.create({ initial: new Map().set('foo', 6) }))).to.be.true;
    expect(result.constructor.name).equals('HashMap');
  });
});
