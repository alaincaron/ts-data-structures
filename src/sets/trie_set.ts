import { SortedMapBasedSet } from './sorted_map_based_set';
import { CollectionInitializer } from '../collections';
import { SortedMapOptions, TrieMap } from '../maps';
import { WithCapacity } from '../utils';

export class TrieSet extends SortedMapBasedSet<string> {
  constructor(delegate?: TrieMap<boolean>) {
    super(delegate ?? new TrieMap());
  }

  protected delegate() {
    return super.delegate() as TrieMap<boolean>;
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

  static create(initializer?: WithCapacity<SortedMapOptions<string> & CollectionInitializer<string>>): TrieSet {
    return SortedMapBasedSet.createSet<string, TrieMap<boolean>, TrieSet>(TrieSet, TrieMap.create, initializer);
  }

  clone(): TrieSet {
    return new TrieSet(this.cloneDelegate<TrieMap<boolean>>(TrieMap));
  }
}
