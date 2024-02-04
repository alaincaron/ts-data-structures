import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { SortedMultiMap } from './sorted_multi_map';
import { SortedMultiMapOptions } from './sorted_multi_map';
import { TrieMap } from '../maps';

export class TrieMultiMap<V> extends SortedMultiMap<string, V> {
  constructor(options?: number | SortedMultiMapOptions<string, V>) {
    super(new TrieMap(options), options);
  }

  static create<V>(
    initializer?: number | (SortedMultiMapOptions<string, V> & MultiMapInitializer<string, V>)
  ): TrieMultiMap<V> {
    return buildMultiMap<string, V, TrieMultiMap<V>>(TrieMultiMap, initializer);
  }

  clone(): TrieMultiMap<V> {
    return TrieMultiMap.create({ initial: this });
  }
}
