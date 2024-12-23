import { Constructor } from 'ts-fluent-iterators';
import { AbstractSortedMultiMap } from './abstract_sorted_multimap';
import { NavigableMultiMap } from './navigable_multimap';
import { MutableCollection } from '../collections';
import { MutableMapEntry, NavigableMap } from '../maps';

export abstract class AbstractNavigableMultiMap<K, V>
  extends AbstractSortedMultiMap<K, V>
  implements NavigableMultiMap<K, V>
{
  protected constructor(
    map: NavigableMap<K, MutableCollection<V>>,
    collectionFactory?: Constructor<MutableCollection<V>>
  ) {
    super(map, collectionFactory);
  }

  protected delegate() {
    return this.map as NavigableMap<K, MutableCollection<V>>;
  }

  lowerKey(key: K): K | undefined {
    return this.delegate().lowerKey(key);
  }

  lowerEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().lowerEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  higherKey(key: K): K | undefined {
    return this.delegate().higherKey(key);
  }

  higherEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().higherEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  floorKey(key: K): K | undefined {
    return this.delegate().floorKey(key);
  }

  floorEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().floorEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  ceilingKey(key: K): K | undefined {
    return this.delegate().ceilingKey(key);
  }

  ceilingEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined {
    const e = this.delegate().ceilingEntry(key);
    return e && { key: e.key, value: e.value.clone() };
  }

  pollFirstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined {
    return this.delegate().pollFirstEntry();
  }

  pollLastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined {
    return this.delegate().pollLastEntry();
  }

  abstract clone(): AbstractNavigableMultiMap<K, V>;
}
