import { SortedMultiSet } from './sorted_multiset';

export interface MutableSortedMultiSet<E> extends SortedMultiSet<E> {
  clone(): SortedMultiSet<E>;
}
