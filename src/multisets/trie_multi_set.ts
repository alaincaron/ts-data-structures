import { buildMultiSet, MultiSetInitializer } from './abstract_multi_set';
import { AbstractSortedMultiSet } from './abstract_sorted_multi_set';
import { Count } from './map_based_multi_set';
import { SortedMapOptions, TrieMap } from '../maps';
import { WithCapacity } from '../utils';

export class TrieMultiSet extends AbstractSortedMultiSet<string> {
  constructor(options?: SortedMapOptions<string>) {
    super(new TrieMap(options));
  }

  protected delegate() {
    return this.map as TrieMap<Count>;
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

  static create(initializer?: WithCapacity<SortedMapOptions<string> & MultiSetInitializer<string>>): TrieMultiSet {
    return buildMultiSet<string, TrieMultiSet, SortedMapOptions<string>>(TrieMultiSet, initializer);
  }

  clone(): TrieMultiSet {
    return TrieMultiSet.create({ initial: this });
  }
}
