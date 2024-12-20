import { FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { MapLike, ReadOnlyMap, ReadOnlyMapEntry } from './readonly_map';

export interface MapEntry<K, V> extends ReadOnlyMapEntry<K, V> {
  set value(v: V);
}

export interface OfferResult<V> {
  accepted: boolean;
  previous?: V;
}

export interface IMap<K, V> extends ReadOnlyMap<K, V> {
  offer(key: K, value: V): OfferResult<V>;

  put(key: K, value: V): V | undefined;

  remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): number;

  filterValues(predicate: Predicate<V>): number;

  filterEntries(predicate: Predicate<[K, V]>): number;

  putAll<K1 extends K, V1 extends V>(map: MapLike<K1, V1>): void;

  clear(): IMap<K, V>;

  entryIterator(): FluentIterator<MapEntry<K, V>>;

  replaceValueIf(predicate: Predicate<[K, V]>, mapper: Mapper<V, V>): IMap<K, V>;

  transformValues(mapper: Mapper<V, V>): IMap<K, V>;

  mapValues<V2>(mapper: Mapper<V, V2>): IMap<K, V2>;

  clone(): IMap<K, V>;
}

export * from './readonly_map';
