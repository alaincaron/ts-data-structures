import { FluentIterator } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map_interface';
import { MutableMap, MutableMapEntry } from './mutable_map';

export interface SortedMap<K, V> extends IMap<K, V> {
  firstEntry(): MapEntry<K, V> | undefined;

  lastEntry(): MapEntry<K, V> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  reverseEntries(): IterableIterator<[K, V]>;

  clone(): SortedMap<K, V>;
}

export interface MutableSortedMap<K, V> extends SortedMap<K, V>, MutableMap<K, V> {
  getEntry(key: K): MutableMapEntry<K, V> | undefined;
  entryIterator(): FluentIterator<MutableMapEntry<K, V>>;
  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, V>>;

  clear(): MutableSortedMap<K, V>;

  clone(): MutableSortedMap<K, V>;
}
