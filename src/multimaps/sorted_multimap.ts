import { FluentIterator } from 'ts-fluent-iterators';
import { MultiMap } from './multimap';
import { Collection } from '../collections';
import { MapEntry } from '../maps';

export interface SortedMultiMap<K, V> extends MultiMap<K, V> {
  firstEntry(): MapEntry<K, Collection<V>> | undefined;

  lastEntry(): MapEntry<K, Collection<V>> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, Collection<V>>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  clear(): SortedMultiMap<K, V>;

  clone(): SortedMultiMap<K, V>;
}
