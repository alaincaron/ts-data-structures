import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import {
  CapacityMixin,
  Container,
  ContainerOptions,
  equalsAny,
  hashIterableUnordered,
  mapToJSON,
  OverflowException,
} from '../utils';

export interface MapEntry<K, V> {
  get key(): K;
  set value(v: V);
  get value(): V;
}

export interface OfferResult<V> {
  accepted: boolean;
  previous?: V;
}

export type MapLike<K, V> = Map<K, V> | IMap<K, V> | Iterable<[K, V]>;

export interface MapInitializer<K, V> {
  initial?: MapLike<K, V>;
}

export abstract class IMap<K, V> implements Iterable<[K, V]>, Container {
  constructor(_options?: number | ContainerOptions) {}

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

  protected abstract getEntry(key: K): MapEntry<K, V> | undefined;

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

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
    const result: OfferResult<V> = { accepted: true };
    if (this.isFull()) {
      const entry = this.getEntry(key);
      if (entry) {
        result.previous = entry.value;
      } else {
        result.accepted = false;
      }
    } else {
      const previous = this.put(key, value);
      if (previous != null) result.previous = previous;
    }
    return result;
  }

  abstract put(key: K, value: V): V | undefined;

  containsKey(key: K) {
    return !!this.getEntry(key);
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (equalsAny(value, v)) return true;
    }
    return false;
  }

  abstract remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>) {
    return this.filterEntries(([k, _]) => predicate(k));
  }

  filterValues(predicate: Predicate<V>) {
    return this.filterEntries(([_, v]) => predicate(v));
  }

  abstract filterEntries(predicate: Predicate<[K, V]>): number;

  putAll<K1 extends K, V1 extends V>(map: MapLike<K1, V1>) {
    for (const [key, value] of map) {
      this.put(key, value);
    }
  }

  abstract clear(): void;

  *keys(): IterableIterator<K> {
    for (const e of this.entryIterator()) yield e.key;
  }

  *values(): IterableIterator<V> {
    for (const e of this.entryIterator()) yield e.value;
  }

  keyIterator() {
    return this.entryIterator().map(e => e.key);
  }

  valueIterator() {
    return this.entryIterator().map(e => e.value);
  }

  abstract entryIterator(): FluentIterator<MapEntry<K, V>>;

  *entries(): IterableIterator<[K, V]> {
    for (const entry of this.entryIterator()) {
      yield [entry.key, entry.value];
    }
  }

  toMap() {
    return new Map(this);
  }

  abstract clone(): IMap<K, V>;

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  buildOptions(): ContainerOptions {
    return {};
  }

  toJson() {
    return mapToJSON(this);
  }

  hashCode() {
    return hashIterableUnordered(this);
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!(other instanceof IMap)) return false;
    if (other.size() !== this.size()) return false;

    for (const [k, v] of this) {
      if (!equalsAny(v, other.get(k))) return false;
    }
    return true;
  }
}

export const BoundedMap = CapacityMixin(IMap);

export function buildMap<
  K,
  V,
  M extends IMap<K, V>,
  Options extends ContainerOptions = ContainerOptions,
  Initializer extends MapInitializer<K, V> = MapInitializer<K, V>,
>(factory: new (...args: any[]) => M, initializer?: number | (Options & Initializer)): M {
  if (initializer == null || typeof initializer === 'number') return new factory(initializer);
  const initialElements = initializer.initial;

  let options: any = undefined;
  if (initialElements && 'buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
    options = { ...(initialElements.buildOptions() as Options), ...initializer };
  } else {
    options = { ...initializer };
  }

  delete options.initial;
  const result = new factory(options);

  if (initialElements) result.putAll(initialElements);
  return result;
}
