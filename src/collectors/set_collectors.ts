import { CollectionCollector } from './collection_collectors';
import { HashMapOptions, LinkedHashMapOptions, SortedMapOptions } from '../maps';
import { AvlTreeSet, HashSet, LinkedHashSet, SkipListSet, SplayTreeSet } from '../sets';

export function hashSetCollector<A>(arg?: HashSet<A> | HashMapOptions): CollectionCollector<A, HashSet<A>> {
  return new CollectionCollector(arg instanceof HashSet ? arg : new HashSet(arg));
}

export function linkedHashSetCollector<A>(
  arg?: LinkedHashSet<A> | LinkedHashMapOptions
): CollectionCollector<A, LinkedHashSet<A>> {
  return new CollectionCollector(arg instanceof LinkedHashSet ? arg : new LinkedHashSet(arg));
}

export function avlTreeSetCollector<A>(
  arg?: AvlTreeSet<A> | SortedMapOptions<A> | number
): CollectionCollector<A, AvlTreeSet<A>> {
  return new CollectionCollector(arg instanceof AvlTreeSet ? arg : new AvlTreeSet(arg));
}

export function SplayTreeSetCollector<A>(
  arg?: SplayTreeSet<A> | SortedMapOptions<A> | number
): CollectionCollector<A, SplayTreeSet<A>> {
  return new CollectionCollector(arg instanceof SplayTreeSet ? arg : new SplayTreeSet(arg));
}

export function skipListSetCollector<A>(
  arg?: SkipListSet<A> | SortedMapOptions<A> | number
): CollectionCollector<A, SkipListSet<A>> {
  return new CollectionCollector(arg instanceof SkipListSet ? arg : new SkipListSet(arg));
}
