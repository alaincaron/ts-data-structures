import { SortedMapBasedSet } from './sorted_map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { SortedMapOptions, TrieMap } from '../maps';

export class TrieSet extends SortedMapBasedSet<string> {
  constructor(options?: number | SortedMapOptions<string>) {
    super(new TrieMap(options));
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

  static create(initializer?: number | (SortedMapOptions<string> & CollectionInitializer<string>)): TrieSet {
    return buildCollection<string, TrieSet>(TrieSet, initializer);
  }

  clone(): TrieSet {
    return TrieSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
