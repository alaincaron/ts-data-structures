import { Collectors, FluentIterator } from 'ts-fluent-iterators';
import { SortedMultiMap, SortedMultiMapOptions } from './sorted_multi_map';
import { Collection } from '../collections';
import { MapEntry, NavigableMap } from '../maps';

export abstract class NavigableMultiMap<K, V> extends SortedMultiMap<K, V> {
  constructor(
    mapFactory: NavigableMap<K, Collection<V>> | (new () => NavigableMap<K, Collection<V>>),
    options?: number | SortedMultiMapOptions<K, V>
  ) {
    super(mapFactory, options);
  }

  protected delegate() {
    return this.map as NavigableMap<K, Collection<V>>;
  }

  lowerKey(key: K): K | undefined {
    return this.delegate().lowerKey(key);
  }

  lowerEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().lowerEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  higherKey(key: K): K | undefined {
    return this.delegate().higherKey(key);
  }

  higherEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().higherEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  floorKey(key: K): K | undefined {
    return this.delegate().floorKey(key);
  }

  floorEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().floorEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  ceilingKey(key: K): K | undefined {
    return this.delegate().ceilingKey(key);
  }

  ceilingEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    const e = this.delegate().ceilingEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  pollFirstEntry(): MapEntry<K, Collection<V>> | undefined {
    return this.delegate().pollFirstEntry();
  }

  pollLastEntry(): MapEntry<K, Collection<V>> | undefined {
    return this.delegate().pollLastEntry();
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

  abstract clone(): NavigableMultiMap<K, V>;
}
