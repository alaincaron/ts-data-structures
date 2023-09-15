import { mapToJSON } from '../utils';
import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map';
import { MapOptions, MapInitializer, MapLike } from './types';

export abstract class AbstractMap<K, V> implements IMap<K, V> {
  private readonly _capacity: number;

  constructor(options?: number | MapOptions) {
    const capacity = typeof options === 'number' ? options : options?.capacity;
    this._capacity = capacity ?? Infinity;
  }

  abstract size(): number;

  capacity() {
    return this._capacity;
  }

  isEmpty() {
    return this.size() === 0;
  }

  isFull() {
    return this.size() >= this.capacity();
  }

  remaining() {
    return this.capacity() - this.size();
  }

  abstract getEntry(key: K): MapEntry<K, V> | undefined;

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

  protected overflowHandler(_key: K, _value: V): boolean {
    return false;
  }

  offer(key: K, value: V) {
    if (this.isFull()) {
      const entry = this.getEntry(key);
      if (entry) {
        const old_value = entry.value;
        entry.value = value;
        return { accepted: true, previous: old_value };
      }
      return { accepted: false };
    }

    return { accepted: true, previous: this.put(key, value) };
  }

  abstract put(key: K, value: V): V | undefined;

  containsKey(key: K) {
    return this.getEntry(key) !== undefined;
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (value === v) return true;
    }
    return false;
  }

  abstract remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): void {
    this.filterEntries(([k, _]) => predicate(k));
  }

  filterValues(predicate: Predicate<V>): void {
    this.filterEntries(([_, v]) => predicate(v));
  }

  abstract filterEntries(predicate: Predicate<[K, V]>): void;

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

  abstract clone(): IMap<K, V>;

  [Symbol.iterator](): Iterator<[K, V]> {
    return this.entries();
  }

  buildOptions(): MapOptions {
    return {
      capacity: this._capacity,
    };
  }

  toJson() {
    return mapToJSON(this);
  }

  static buildMap<
    K,
    V,
    M extends IMap<K, V>,
    Options extends MapOptions = MapOptions,
    Initializer extends MapInitializer<K, V> = MapInitializer<K, V>,
  >(factory: (options?: number | Options) => M, initializer?: number | (Options & Initializer)): M {
    if (initializer == null || typeof initializer === 'number') return factory(initializer);
    const initialElements = initializer.initial;

    let options: any = undefined;
    if (initialElements && 'buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
      options = { ...(initialElements.buildOptions() as MapOptions), ...initializer };
    } else {
      options = { ...initializer };
    }

    delete options.initial;
    const result = factory(options);

    if (initialElements) result.putAll(initialElements);
    return result;
  }
}
