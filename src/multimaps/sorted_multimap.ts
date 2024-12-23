import { FluentIterator } from 'ts-fluent-iterators';
import { MutableMultiMap } from './mutable_multimap';
import { MutableCollection } from '../collections';
import { MutableMapEntry } from '../maps';

export interface SortedMultiMap<K, V> extends MutableMultiMap<K, V> {
  firstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  lastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, MutableCollection<V>>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  clear(): SortedMultiMap<K, V>;

  clone(): SortedMultiMap<K, V>;
}
