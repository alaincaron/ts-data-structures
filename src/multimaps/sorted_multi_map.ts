import { Collectors, FluentIterator } from 'ts-fluent-iterators';
import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { Collection } from '../collections';
import { MapEntry, SortedMap, SortedMapOptions } from '../maps';

export type SortedMultiMapOptions<K, V> = SortedMapOptions<K> & MapBasedMultiMapOptions<V>;

export abstract class SortedMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(
    mapFactory: SortedMap<K, Collection<V>> | (new () => SortedMap<K, Collection<V>>),
    options?: number | SortedMultiMapOptions<K, V>
  ) {
    super(mapFactory, options);
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
    return this.delegate().reverseValueIterator().collectTo(new Collectors.FlattenCollector());
  }

  abstract clone(): SortedMultiMap<K, V>;
}
