import { CollectionCollector } from './collection_collectors';
import { HashMapOptions, LinkedHashMapOptions, SortedMapOptions } from '../maps';
import { AvlTreeSet, HashSet, LinkedHashSet, SkipListSet, SplayTreeSet } from '../sets';
import { WithCapacity } from '../utils';

export function hashSetCollector<A>(
  arg?: HashSet<A> | WithCapacity<HashMapOptions>
): CollectionCollector<A, HashSet<A>> {
  return new CollectionCollector(arg instanceof HashSet ? arg : HashSet.create(arg));
}

export function linkedHashSetCollector<A>(
  arg?: LinkedHashSet<A> | WithCapacity<LinkedHashMapOptions>
): CollectionCollector<A, LinkedHashSet<A>> {
  return new CollectionCollector(arg instanceof LinkedHashSet ? arg : LinkedHashSet.create(arg));
}

export function avlTreeSetCollector<A>(
  arg?: AvlTreeSet<A> | WithCapacity<SortedMapOptions<A>>
): CollectionCollector<A, AvlTreeSet<A>> {
  return new CollectionCollector(arg instanceof AvlTreeSet ? arg : AvlTreeSet.create(arg));
}

export function SplayTreeSetCollector<A>(
  arg?: SplayTreeSet<A> | WithCapacity<SortedMapOptions<A>>
): CollectionCollector<A, SplayTreeSet<A>> {
  return new CollectionCollector(arg instanceof SplayTreeSet ? arg : SplayTreeSet.create(arg));
}

export function skipListSetCollector<A>(
  arg?: SkipListSet<A> | WithCapacity<SortedMapOptions<A>>
): CollectionCollector<A, SkipListSet<A>> {
  return new CollectionCollector(arg instanceof SkipListSet ? arg : SkipListSet.create(arg));
}
