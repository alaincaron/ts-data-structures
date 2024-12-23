import { FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { IMap, MapEntry, MapLike } from './map_interface';

export interface MutableMapEntry<K, V> extends MapEntry<K, V> {
  set value(v: V);
}

export interface OfferResult<V> {
  accepted: boolean;
  previous?: V;
}

export interface MutableMap<K, V> extends IMap<K, V> {
  getEntry(key: K): MutableMapEntry<K, V> | undefined;

  offer(key: K, value: V): OfferResult<V>;

  put(key: K, value: V): V | undefined;

  remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): number;

  filterValues(predicate: Predicate<V>): number;

  filterEntries(predicate: Predicate<[K, V]>): number;

  putAll<K1 extends K, V1 extends V>(map: MapLike<K1, V1>): void;

  clear(): MutableMap<K, V>;

  entryIterator(): FluentIterator<MutableMapEntry<K, V>>;

  replaceValueIf(predicate: Predicate<[K, V]>, mapper: Mapper<V, V>): MutableMap<K, V>;

  transformValues(mapper: Mapper<V, V>): MutableMap<K, V>;

  mapValues<V2>(mapper: Mapper<V, V2>): MutableMap<K, V2>;

  clone(): MutableMap<K, V>;
}

export * from './map_interface';
