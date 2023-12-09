import { FluentIterator } from 'ts-fluent-iterators';
import { SortedSet } from './sorted_set';

export interface NavigableSet<E> extends SortedSet<E> {
  floor(e: E): E | undefined;
  ceiling(e: E): E | undefined;
  lower(e: E): E | undefined;
  higher(e: E): E | undefined;

  pollFirst(): E | undefined;
  pollLast(): E | undefined;

  reverseIterator(): FluentIterator<E>;
}
