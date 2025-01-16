import { Comparator, Comparators } from 'ts-fluent-iterators';
import { SingletonMultiMap } from './singletonMultiMap';
import { Collection } from '../collections';
import { MapEntry } from '../maps';
import { NavigableMultiMap } from '../multimaps';

export class SingletonNavigableMultiMap<K, V> extends SingletonMultiMap<K, V> implements NavigableMultiMap<K, V> {
  constructor(
    key: K,
    value: V,
    private readonly comparator: Comparator<K> = Comparators.natural
  ) {
    super(key, value);
  }
  lowerKey(key: K): K | undefined {
    return this.lowerEntry(key)?.key;
  }
  lowerEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    return this.comparator(key, this.getKey()) > 0 ? this.getEntry() : undefined;
  }

  higherKey(key: K): K | undefined {
    return this.higherEntry(key)?.key;
  }

  higherEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    return this.comparator(key, this.getKey()) < 0 ? this.getEntry() : undefined;
  }

  floorKey(key: K): K | undefined {
    return this.floorEntry(key)?.key;
  }

  floorEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    return this.comparator(key, this.getKey()) >= 0 ? this.getEntry() : undefined;
  }

  ceilingKey(key: K): K | undefined {
    return this.ceilingEntry(key)?.key;
  }

  ceilingEntry(key: K): MapEntry<K, Collection<V>> | undefined {
    return this.comparator(key, this.getKey()) <= 0 ? this.getEntry() : undefined;
  }
}
