import { FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { ContainerInterface } from '../utils';

export interface MapEntry<K, V> {
  get key(): K;
  set value(v: V);
  get value(): V;
}

export type MapLike<K, V> = Map<K, V> | IMap<K, V> | Iterable<[K, V]>;

export interface OfferResult<V> {
  accepted: boolean;
  previous?: V;
}

export interface IMap<K, V> extends ContainerInterface, Iterable<[K, V]> {
  get(key: K): V | undefined;

  offer(key: K, value: V): OfferResult<V>;

  put(key: K, value: V): V | undefined;

  containsKey(key: K): boolean;

  containsValue(value: V): boolean;

  remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): number;

  filterValues(predicate: Predicate<V>): number;

  filterEntries(predicate: Predicate<[K, V]>): number;

  putAll<K1 extends K, V1 extends V>(map: MapLike<K1, V1>): void;

  clear(): IMap<K, V>;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V>;

  [Symbol.iterator](): Iterator<[K, V]>;

  keyIterator(): FluentIterator<K>;

  valueIterator(): FluentIterator<V>;

  entryIterator(): FluentIterator<MapEntry<K, V>>;

  entries(): IterableIterator<[K, V]>;

  replaceValueIf(predicate: Predicate<[K, V]>, mapper: Mapper<V, V>): IMap<K, V>;

  transformValues(mapper: Mapper<V, V>): IMap<K, V>;

  mapValues<V2>(mapper: Mapper<V, V2>): IMap<K, V2>;

  toMap(): Map<K, V>;

  clone(): IMap<K, V>;

  toJSON(): string;

  hashCode(): number;

  equals(other: unknown): boolean;
}
