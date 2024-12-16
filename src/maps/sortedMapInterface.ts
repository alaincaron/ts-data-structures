import { FluentIterator } from 'ts-fluent-iterators';
import { Map_interface, MapEntry } from './map_interface';

export interface SortedMapInterface<K, V> extends Map_interface<K, V> {
  firstEntry(): MapEntry<K, V> | undefined;

  lastEntry(): MapEntry<K, V> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  reverseEntries(): IterableIterator<[K, V]>;

  clear(): SortedMapInterface<K, V>;

  clone(): SortedMapInterface<K, V>;
}
