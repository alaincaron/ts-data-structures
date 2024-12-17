import { FluentIterator } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map_interface';

export interface SortedMap<K, V> extends IMap<K, V> {
  firstEntry(): MapEntry<K, V> | undefined;

  lastEntry(): MapEntry<K, V> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  reverseEntries(): IterableIterator<[K, V]>;

  clear(): SortedMap<K, V>;

  clone(): SortedMap<K, V>;
}
