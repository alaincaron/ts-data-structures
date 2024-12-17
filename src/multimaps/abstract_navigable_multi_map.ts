import { AbstractSortedMultiMap } from './abstract_sorted_multi_map';
import { NavigableMultiMap } from './navigable_multi_map';
import { Collection } from '../collections';
import { MapEntry, NavigableMap } from '../maps';
import { Constructor } from '../utils';

export abstract class AbstractNavigableMultiMap<K, V>
  extends AbstractSortedMultiMap<K, V>
  implements NavigableMultiMap<K, V>
{
  protected constructor(map: NavigableMap<K, Collection<V>>, collectionFactory?: Constructor<Collection<V>>) {
    super(map, collectionFactory);
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

  abstract clone(): AbstractNavigableMultiMap<K, V>;
}
