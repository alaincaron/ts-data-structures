import { FluentIterator } from 'ts-fluent-iterators';
import { ISet, MutableSet } from './set_interface';

export interface SortedSet<E> extends ISet<E> {
  first(): E | undefined;
  last(): E | undefined;

  reverseIterator(): FluentIterator<E>;
}

export interface MutableSortedSet<E> extends MutableSet<E>, SortedSet<E> {
  clone(): MutableSortedSet<E>;
}
