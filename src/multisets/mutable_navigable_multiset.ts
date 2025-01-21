import { MultiSetEntry } from './multiset';
import { MutableSortedMultiSet } from './mutable_sorted_multiset';
import { NavigableMultiSet } from './navigable_multiset';

export interface MutableNavigableMultiSet<E> extends NavigableMultiSet<E>, MutableSortedMultiSet<E> {
  pollFirstEntry(): MultiSetEntry<E> | undefined;

  pollLastEntry(): MultiSetEntry<E> | undefined;

  pollFirst(): E | undefined;

  pollLast(): E | undefined;

  removeFirst(): E;
  removeLast(): E;

  clone(): MutableNavigableMultiSet<E>;
}
