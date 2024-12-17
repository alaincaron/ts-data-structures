import { FluentIterator } from 'ts-fluent-iterators';
import { ISet } from './set_interface';

export interface SortedSet<E> extends ISet<E> {
  first(): E | undefined;
  last(): E | undefined;

  reverseIterator(): FluentIterator<E>;
}
