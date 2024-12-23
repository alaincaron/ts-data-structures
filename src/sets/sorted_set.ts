import { FluentIterator } from 'ts-fluent-iterators';
import { MutableSet } from './set_interface';

export interface SortedSet<E> extends MutableSet<E> {
  first(): E | undefined;
  last(): E | undefined;

  reverseIterator(): FluentIterator<E>;
}
