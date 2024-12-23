import { FluentIterator } from 'ts-fluent-iterators';
import { MutableMap, MutableMapEntry } from './mutable_map';

export interface SortedMap<K, V> extends MutableMap<K, V> {
  firstEntry(): MutableMapEntry<K, V> | undefined;

  lastEntry(): MutableMapEntry<K, V> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, V>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  reverseEntries(): IterableIterator<[K, V]>;

  clear(): SortedMap<K, V>;

  clone(): SortedMap<K, V>;
}
