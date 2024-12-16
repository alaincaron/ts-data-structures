import { FluentIterator } from 'ts-fluent-iterators';
import { MultiMapInterface } from './multi_map_interface';
import { Collection } from '../collections';
import { MapEntry } from '../maps';

export interface SortedMultiMapInterface<K, V> extends MultiMapInterface<K, V> {
  firstEntry(): MapEntry<K, Collection<V>> | undefined;

  lastEntry(): MapEntry<K, Collection<V>> | undefined;

  firstKey(): K | undefined;

  lastKey(): K | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, Collection<V>>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  clear(): SortedMultiMapInterface<K, V>;

  clone(): SortedMultiMapInterface<K, V>;
}
