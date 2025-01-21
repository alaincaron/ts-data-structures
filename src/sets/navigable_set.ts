import { MutableSortedSet, SortedSet } from './sorted_set';

export interface NavigableSet<E> extends SortedSet<E> {
  floor(e: E): E | undefined;
  ceiling(e: E): E | undefined;
  lower(e: E): E | undefined;
  higher(e: E): E | undefined;
}

export interface MutableNavigableSet<E> extends NavigableSet<E>, MutableSortedSet<E> {
  pollFirst(): E | undefined;
  pollLast(): E | undefined;
  clone(): MutableNavigableSet<E>;
}
