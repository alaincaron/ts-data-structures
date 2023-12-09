import { Predicate } from 'ts-fluent-iterators';
import { BoundedMap, buildMap } from './abstract_map';
import { MapEntry } from './map';
import { MapInitializer } from './types';
import { ContainerOptions, OverflowException } from '../utils';

export interface AdapterMapOptions<K, V> extends ContainerOptions {
  delegate?: Map<K, V>;
}
export class AdapterMap<K, V> extends BoundedMap<K, V> {
  protected readonly _delegate: Map<K, V>;

  constructor(options?: number | AdapterMapOptions<K, V>) {
    super(options);
    let delegate: Map<K, V> | undefined = undefined;
    if (typeof options === 'object' && 'delegate' in options) delegate = options.delegate;
    this._delegate = delegate ?? new Map<K, V>();
  }

  static create<K, V>(initializer?: number | AdapterMapOptions<K, V> | MapInitializer<K, V>): AdapterMap<K, V> {
    return buildMap<K, V, AdapterMap<K, V>, AdapterMapOptions<K, V>>(AdapterMap, initializer);
  }

  protected delegate() {
    return this._delegate;
  }

  size() {
    return this._delegate.size;
  }

  clear() {
    this._delegate.clear();
  }

  protected getEntry(key: K): MapEntry<K, V> | undefined {
    const value = this._delegate.get(key);
    if (value == null) return undefined;
    return { key, value };
  }

  put(key: K, value: V): V | undefined {
    const old_value = this._delegate.get(key);
    if (old_value == null && this.isFull()) throw new OverflowException();
    this._delegate.set(key, value);
    return old_value;
  }

  remove(key: K): V | undefined {
    const old_value = this._delegate.get(key);
    this._delegate.delete(key);
    return old_value;
  }

  filterEntries(predicate: Predicate<[K, V]>): number {
    let count = 0;
    for (const entry of this._delegate) {
      if (!predicate(entry)) {
        ++count;
        this._delegate.delete(entry[0]);
      }
    }
    return count;
  }

  keys() {
    return this._delegate.keys();
  }

  values() {
    return this._delegate.values();
  }

  keyIterator() {
    return this._delegate.keyIterator();
  }

  valueIterator() {
    return this._delegate.valueIterator();
  }

  entryIterator() {
    return this._delegate.iterator().map(([key, value]) => {
      return { key, value };
    });
  }

  toMap() {
    return this._delegate;
  }

  clone(): AdapterMap<K, V> {
    return AdapterMap.create<K, V>({ initial: this });
  }
}
