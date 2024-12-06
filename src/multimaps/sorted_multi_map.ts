import { FlattenCollector, FluentIterator } from 'ts-fluent-iterators';
import { MapBasedMultiMap } from './map_based_multi_map';
import { WithCollectionFactory } from './map_based_multi_map';
import { Collection } from '../collections';
import { MapEntry, SortedMap, SortedMapOptions } from '../maps';
import { Constructor } from '../utils';

export type SortedMultiMapOptions<K, V> = WithCollectionFactory<SortedMapOptions<K>, V>;

export abstract class SortedMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(map: SortedMap<K, Collection<V>>, collectionFactory?: Constructor<Collection<V>>) {
    super(map, collectionFactory);
  }

  protected delegate() {
    return this.map as SortedMap<K, Collection<V>>;
  }

  firstEntry(): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  lastEntry(): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  firstKey(): K | undefined {
    return this.delegate().firstKey();
  }

  lastKey(): K | undefined {
    return this.delegate().lastKey();
  }

  reverseEntryIterator(): FluentIterator<MapEntry<K, Collection<V>>> {
    return this.delegate()
      .reverseEntryIterator()
      .map(e => ({ key: e.key, value: e.value.clone() }));
  }

  reverseKeyIterator(): FluentIterator<K> {
    return this.delegate().reverseKeyIterator();
  }

  reverseValueIterator(): FluentIterator<V> {
    return this.delegate().reverseValueIterator().collectTo(new FlattenCollector());
  }

  abstract clone(): SortedMultiMap<K, V>;
}
