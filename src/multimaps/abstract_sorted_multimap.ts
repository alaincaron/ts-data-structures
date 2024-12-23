import { Constructor, FlattenCollector, FluentIterator } from 'ts-fluent-iterators';
import { MapBasedMultiMap } from './map_based_multimap';
import { WithCollectionFactory } from './map_based_multimap';
import { SortedMultiMap } from './sorted_multimap';
import { MutableCollection } from '../collections';
import { MutableMapEntry, SortedMap, SortedMapOptions } from '../maps';

export type SortedMultiMapOptions<K, V> = WithCollectionFactory<SortedMapOptions<K>, V>;

export abstract class AbstractSortedMultiMap<K, V> extends MapBasedMultiMap<K, V> implements SortedMultiMap<K, V> {
  protected constructor(
    map: SortedMap<K, MutableCollection<V>>,
    collectionFactory?: Constructor<MutableCollection<V>>
  ) {
    super(map, collectionFactory);
  }

  protected delegate() {
    return this.map as SortedMap<K, MutableCollection<V>>;
  }

  firstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  lastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  firstKey(): K | undefined {
    return this.delegate().firstKey();
  }

  lastKey(): K | undefined {
    return this.delegate().lastKey();
  }

  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, MutableCollection<V>>> {
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

  abstract clone(): AbstractSortedMultiMap<K, V>;
}
