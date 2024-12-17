import { buildMultiMap, MultiMapInitializer } from './abstract_multi_map';
import { AbstractSortedMultiMap, SortedMultiMapOptions } from './abstract_sorted_multi_map';
import { Collection } from '../collections';
import { MapEntry, TrieMap } from '../maps';
import { WithCapacity } from '../utils';

export class TrieMultiMap<V> extends AbstractSortedMultiMap<string, V> {
  constructor(options?: SortedMultiMapOptions<string, V>) {
    super(new TrieMap(options), options?.collectionFactory);
  }

  protected delegate() {
    return this.map as TrieMap<Collection<V>>;
  }

  firstEntry(): MapEntry<string, Collection<V>> | undefined {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  lastEntry(): MapEntry<string, Collection<V>> | undefined {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  firstKey(): string | undefined {
    return this.delegate().firstKey();
  }

  lastKey(): string | undefined {
    return this.delegate().lastKey();
  }

  getHeight() {
    return this.delegate().getHeight();
  }

  hasPrefix(input: string, pure: boolean = true) {
    return this.delegate().hasPrefix(input, pure);
  }

  hasCommonPrefix(input: string) {
    return this.delegate().hasCommonPrefix(input);
  }

  getLongestCommonPrefix() {
    return this.delegate().getLongestCommonPrefix();
  }

  *words(prefix: string) {
    for (const w of this.delegate().words(prefix)) {
      yield w.key;
    }
  }

  wordIterator(prefix: string) {
    return this.delegate()
      .wordIterator(prefix)
      .map(x => x.key);
  }

  static create<V>(
    initializer?: WithCapacity<SortedMultiMapOptions<string, V> & MultiMapInitializer<string, V>>
  ): TrieMultiMap<V> {
    return buildMultiMap<string, V, TrieMultiMap<V>>(TrieMultiMap, initializer);
  }

  clone(): TrieMultiMap<V> {
    return TrieMultiMap.create({ initial: this });
  }
}
