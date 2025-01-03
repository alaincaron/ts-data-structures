import { BiMap, BiMapOptions } from './bimap';
import { AvlTreeMap, MapInitializer, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export function createAvlTreeBiMap<K, V>(
  initializer?: WithCapacity<BiMapOptions<SortedMapOptions<K>, SortedMapOptions<V>> & MapInitializer<K, V>>
): BiMap<K, V> {
  return BiMap.create<K, V, AvlTreeMap<K, V>, AvlTreeMap<V, K>, SortedMapOptions<K>, SortedMapOptions<V>>(
    AvlTreeMap,
    AvlTreeMap,
    initializer
  );
}
