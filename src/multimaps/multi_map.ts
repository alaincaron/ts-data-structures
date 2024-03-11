import { Collectors, FluentIterator, Generators, iterator, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { MapLike } from '../maps';
import {
  CapacityMixin,
  Constructor,
  Container,
  ContainerOptions,
  equalsAny,
  hashIterableUnordered,
  OverflowException,
  WithCapacity,
} from '../utils';

export type MultiMapLike<K, V> = MapLike<K, V> | MultiMap<K, V>;

export interface MultiMapInitializer<K, V> {
  initial?: MultiMapLike<K, V>;
}

export abstract class MultiMap<K, V> implements Iterable<[K, V]>, Container {
  abstract size(): number;
  abstract capacity(): number;

  isEmpty() {
    return this.size() === 0;
  }

  isFull() {
    return this.size() >= this.capacity();
  }

  remaining() {
    return this.capacity() - this.size();
  }

  get(k: K): Collection<V> | undefined {
    const values = this.getValues(k);
    return values && values.clone();
  }

  protected abstract getValues(k: K): Collection<V> | undefined;

  abstract removeEntry(key: K, value: V): boolean;
  abstract removeKey(key: K): Collection<V> | undefined;

  protected overflowHandler(_key: K, _value: V): boolean {
    return false;
  }

  protected handleOverflow(key: K, value: V): boolean {
    if (!this.isFull()) return false;
    if (this.overflowHandler(key, value)) return true;
    if (this.isFull()) throw new OverflowException();
    return false;
  }

  offer(key: K, value: V) {
    if (this.isFull()) return false;
    return this.put(key, value);
  }

  abstract put(key: K, value: V): boolean;

  putAll<K1 extends K, V1 extends V>(map: MultiMapLike<K1, V1>) {
    for (const [key, value] of map) {
      this.put(key, value);
    }
  }

  abstract clear(): void;

  containsKey(key: K) {
    const col = this.getValues(key);
    return col ? !col.isEmpty() : false;
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (equalsAny(value, v)) return true;
    }
    return false;
  }

  containsEntry(key: K, value: V) {
    const col = this.getValues(key);
    if (!col) return false;
    return col.contains(value);
  }

  abstract filterKeys(predicate: Predicate<K>): number;
  abstract filterEntries(predicate: Predicate<[K, V]>): number;

  filterValues(predicate: Predicate<V>): number {
    return this.filterEntries(([_, v]) => predicate(v));
  }

  protected abstract rawIterator(): IterableIterator<[K, Collection<V>]>;

  *keys(): IterableIterator<K> {
    for (const [k, _] of this.rawIterator()) {
      yield k;
    }
  }

  *values(): IterableIterator<V> {
    for (const [_, v] of this.rawIterator()) {
      yield* v;
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const [k, values] of this.rawIterator()) {
      for (const v of values) {
        yield [k, v];
      }
    }
  }

  *partitions(): IterableIterator<[K, Collection<V>]> {
    for (const [k, values] of this.rawIterator()) {
      yield [k, values.clone()];
    }
  }

  keyIterator(): FluentIterator<K> {
    return new FluentIterator(this.rawIterator()).map(([k, _]) => k);
  }

  valueIterator(): FluentIterator<V> {
    return new FluentIterator(this.rawIterator())
      .map(([_, values]) => values)
      .collectTo(new Collectors.FlattenCollector());
  }

  partitionIterator(): FluentIterator<[K, Collection<V>]> {
    return new FluentIterator(this.partitions());
  }

  entryIterator(): FluentIterator<[K, V]> {
    return new FluentIterator(this.rawIterator())
      .map(([k, values]) => iterator(Generators.repeat(_ => k)).zip(values))
      .collectTo(new Collectors.FlattenCollector());
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  abstract toJson(): string;

  buildOptions() {
    return {};
  }

  abstract clone(): MultiMap<K, V>;

  hashCode() {
    return hashIterableUnordered(this.rawIterator());
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!(other instanceof MultiMap)) return false;
    if (other.size() !== this.size()) return false;

    for (const [k, values] of this.rawIterator()) {
      if (!equalsAny(values, other.getValues(k))) return false;
    }
    return true;
  }
}

export function buildMultiMap<
  K,
  V,
  M extends MultiMap<K, V>,
  Options extends object = object,
  Initializer extends MultiMapInitializer<K, V> = MultiMapInitializer<K, V>,
>(factory: Constructor<M>, initializer?: WithCapacity<Options & Initializer>): M {
  if (initializer == null) return new factory();
  const initialElements = initializer.initial;

  let options: any = undefined;
  if (initialElements && 'buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
    options = { ...(initialElements.buildOptions() as Options), ...initializer };
  } else {
    options = { ...initializer };
  }

  delete options.initial;
  const result = boundMultiMap(factory, options);

  if (initialElements) result.putAll(initialElements);
  return result;
}

function boundMultiMap<K, V, M extends MultiMap<K, V>>(ctor: Constructor<M>, options?: number | ContainerOptions) {
  if (typeof options === 'number' || (options && 'capacity' in options)) {
    const boundedCtor: any = CapacityMixin(ctor);
    const tmp = new boundedCtor(options);
    return tmp as unknown as M;
  }
  return new ctor(options);
}
