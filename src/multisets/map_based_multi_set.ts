import { Predicate } from 'ts-fluent-iterators';
import { BoundedMultiSet, Count } from './multi_set';
import { IMap } from '../maps';
import { ContainerOptions, OverflowException } from '../utils';

export abstract class MapBasedMultiSet<E> extends BoundedMultiSet<E> {
  private readonly map: IMap<E, Count>;
  private _size: number;

  constructor(mapFactory: IMap<E, Count> | (new () => IMap<E, Count>), options?: number | ContainerOptions) {
    super(options);
    this._size = 0;
    if (typeof mapFactory === 'function') {
      this.map = new mapFactory();
    } else {
      this.map = mapFactory;
    }
  }

  size() {
    return this._size;
  }

  clear() {
    this._size = 0;
    this.map.clear();
  }

  count(item: E): number {
    const e = this.map.get(item);
    return e?.count ?? 0;
  }

  offerCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    const x = Math.min(this.remaining(), count);
    if (x === 0) return 0;
    const e = this.map.get(item);
    if (e) {
      e.count += x;
    } else {
      this.map.put(item, { count });
    }
    this._size += x;
    return x;
  }

  removeCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    if (count === 0) return 0;
    const e = this.map.get(item);
    if (!e) return 0;
    const x = Math.min(e.count, count);
    e.count -= x;
    if (!e.count) this.map.remove(item);
    this._size -= x;
    return x;
  }

  setCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    const e = this.map.get(item);

    if (!e) {
      if (count === 0) return 0;
      this.map.put(item, { count });
      this._size += count;
      return 0;
    }
    if (count === 0) {
      this.map.remove(item);
      this._size -= e.count;
      return e.count;
    } else {
      const oldCount = e.count;
      const x = count - oldCount;
      if (x > this.remaining()) throw new OverflowException();
      this._size += x;
      e.count = count;
      return oldCount;
    }
  }

  removeMatchingItem(predicate: Predicate<E>) {
    for (const [e, counter] of this.map.entries()) {
      if (predicate(e)) {
        if (--counter.count === 0) {
          this.map.remove(e);
        }
        --this._size;
        return e;
      }
    }
    return undefined;
  }

  filter(predicate: Predicate<E>) {
    const removedEntries = [];
    for (const e of this.map.entries()) {
      if (!predicate(e[0])) removedEntries.push(e);
    }
    let nbRemoved = 0;
    for (const e of removedEntries) {
      this.map.remove(e[0]);
      nbRemoved += e[1].count;
    }
    this._size -= nbRemoved;
    return nbRemoved;
  }

  *[Symbol.iterator](): IterableIterator<E> {
    for (const [e, { count }] of this.map.entries()) {
      for (let i = 0; i < count; ++i) yield e;
    }
  }

  *entries(): IterableIterator<[E, number]> {
    for (const [e, { count }] of this.map.entries()) {
      yield [e, count];
    }
  }
}
