import { Constructor, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { AbstractMultiSet } from './abstract_multiset';
import { MutableMap } from '../maps';
import { OverflowException } from '../utils';

export abstract class MapBasedMultiSet<
  E,
  M extends MutableMap<E, number>,
  Options extends object = object,
> extends AbstractMultiSet<E> {
  protected readonly map: MutableMap<E, number>;
  private _size: number;

  protected constructor(ctor: Constructor<M, [Options | undefined]>, options?: Options) {
    super();
    this.map = new ctor(options);
    this._size = 0;
  }

  size() {
    return this._size;
  }

  clear() {
    this._size = 0;
    this.map.clear();
    return this;
  }

  count(item: E): number {
    const e = this.map.get(item);
    return e ?? 0;
  }

  offerCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    const x = Math.min(this.remaining(), count);
    if (x === 0) return 0;
    const e = this.map.getEntry(item);
    if (e) {
      e.value += x;
    } else {
      this.map.put(item, x);
    }
    this._size += x;
    return x;
  }

  removeCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    if (count === 0) return 0;
    const e = this.map.getEntry(item);
    if (!e) return 0;
    const x = Math.min(e.value, count);
    e.value -= x;
    if (!e.value) this.map.remove(item);
    this._size -= x;
    return x;
  }

  setCount(item: E, count: number): number {
    if (count < 0 || !Number.isSafeInteger(count)) throw new Error(`Invalid count: ${count}`);
    const e = this.map.getEntry(item);

    if (!e) {
      if (count === 0) return 0;
      if (count > this.remaining()) throw new OverflowException();
      this.map.put(item, count);
      this._size += count;
      return 0;
    }
    if (count === 0) {
      this.map.remove(item);
      this._size -= e.value;
      return e.value;
    } else {
      const oldValue = e.value;
      const x = count - oldValue;
      if (x > this.remaining()) throw new OverflowException();
      this._size += x;
      e.value = count;
      return oldValue;
    }
  }

  removeMatchingItem(predicate: Predicate<E>) {
    for (const e of this.map.entryIterator()) {
      if (predicate(e.key)) {
        if (--e.value === 0) {
          this.map.remove(e.key);
        }
        --this._size;
        return e.key;
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
      nbRemoved += e[1];
    }
    this._size -= nbRemoved;
    return nbRemoved;
  }

  *[Symbol.iterator](): IterableIterator<E> {
    for (const [key, count] of this.map.entries()) {
      for (let i = 0; i < count; ++i) yield key;
    }
  }

  *entries(): IterableIterator<[E, number]> {
    for (const e of this.map.entries()) {
      yield e;
    }
  }

  keyIterator(): FluentIterator<E> {
    return this.map.keyIterator();
  }

  keys(): IterableIterator<E> {
    return this.map.keys();
  }

  nbKeys(): number {
    return this.map.size();
  }

  entryIterator(): FluentIterator<[E, number]> {
    return FluentIterator.from(this.map);
  }

  abstract clone(): MapBasedMultiSet<E, M, Options>;
}
