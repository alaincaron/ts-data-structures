import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { SortedMultiSet } from './sorted_multi_set';
import { SortedMapOptions, TrieMap } from '../maps';

export class TrieMapMultiSet extends SortedMultiSet<string> {
  constructor(options?: number | SortedMapOptions<string>) {
    super(new TrieMap(options), options);
  }

  static create(initializer?: number | (SortedMapOptions<string> & MultiSetInitializer<string>)): TrieMapMultiSet {
    return buildMultiSet<string, TrieMapMultiSet>(TrieMapMultiSet, initializer);
  }

  clone(): TrieMapMultiSet {
    return TrieMapMultiSet.create({ initial: this });
  }
}
