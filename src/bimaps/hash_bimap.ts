import { BiMap, BiMapOptions } from './bimap';
import { HashMap, HashMapOptions, MapInitializer } from '../maps';
import { WithCapacity } from '../utils';

export function createHashBiMap<K, V>(
  initializer?: WithCapacity<BiMapOptions<HashMapOptions, HashMapOptions> & MapInitializer<K, V>>
): BiMap<K, V> {
  return BiMap.create<K, V, HashMap<K, V>, HashMap<V, K>, HashMapOptions, HashMapOptions>(
    HashMap,
    HashMap,
    initializer
  );
}
