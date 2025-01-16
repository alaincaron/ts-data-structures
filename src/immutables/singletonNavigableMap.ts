import { Comparator, Comparators } from 'ts-fluent-iterators';
import { SingletonMap } from './singletonMap';
import { MapEntry, MutableMapEntry, NavigableMap } from '../maps';

export class SingletonNavigableMap<K, V> extends SingletonMap<K, V> implements NavigableMap<K, V> {
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

  lowerEntry(key: K): MapEntry<K, V> | undefined {
    return this.comparator(key, this.entry.key) > 0 ? this.entry : undefined;
  }

  higherKey(key: K): K | undefined {
    return this.higherEntry(key)?.key;
  }

  higherEntry(key: K): MapEntry<K, V> | undefined {
    return this.comparator(key, this.entry.key) < 0 ? this.entry : undefined;
  }

  floorEntry(key: K): MapEntry<K, V> | undefined {
    return this.comparator(key, this.entry.key) >= 0 ? this.entry : undefined;
  }

  floorKey(key: K): K | undefined {
    return this.floorEntry(key)?.key;
  }

  ceilingKey(key: K): K | undefined {
    return this.ceilingEntry(key)?.key;
  }

  ceilingEntry(key: K): MutableMapEntry<K, V> | undefined {
    return this.comparator(key, this.entry.key) <= 0 ? this.entry : undefined;
  }

  clone() {
    return this;
  }
}
