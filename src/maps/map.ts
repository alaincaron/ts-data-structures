import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { MapLike } from './types';
import { ContainerOptions } from '../utils';

export interface MapEntry<K, V> {
  get key(): K;
  set value(v: V);
  get value(): V;
}

export interface OfferResult<V> {
  accepted: boolean;
  previous?: V;
}

export interface IMap<K = any, V = any> extends Iterable<[K, V]> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;
  remaining(): number;

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

  clear(): void;

  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;

  keyIterator(): FluentIterator<K>;
  valueIterator(): FluentIterator<V>;
  entryIterator(): FluentIterator<MapEntry<K, V>>;

  toJson(): string;
  buildOptions?(): ContainerOptions;

  toMap(): Map<K, V>;
  clone(): IMap<K, V>;
}
