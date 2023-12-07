import { Comparator, FluentIterator } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map';
import { ContainerOptions } from '../utils';

export interface SortedMapOptions<K> extends ContainerOptions {
  comparator?: Comparator<K>;
}

export interface SortedMap<K, V> extends IMap<K, V> {
  firstKey(): K | undefined;
  lastKey(): K | undefined;

  firstEntry(): MapEntry<K, V> | undefined;
  lastEntry(): MapEntry<K, V> | undefined;

  floorKey(k: K): K | undefined;
  floorEntry(k: K): MapEntry<K, V> | undefined;

  ceilingKey(k: K): K | undefined;
  ceilingEntry(k: K): MapEntry<K, V> | undefined;

  lowerKey(k: K): K | undefined;
  lowerEntry(k: K): MapEntry<K, V> | undefined;

  higherKey(k: K): K | undefined;
  higherEntry(k: K): MapEntry<K, V> | undefined;

  pollFirstEntry(): MapEntry<K, V> | undefined;
  pollLastEntry(): MapEntry<K, V> | undefined;

  reverseKeyIterator(): FluentIterator<K>;
  reverseValueIterator(): FluentIterator<V>;
  reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;
  reverseEntries(): IterableIterator<[K, V]>;
}
