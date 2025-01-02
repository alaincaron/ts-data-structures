import { FluentIterator } from 'ts-fluent-iterators';
import { MultiSet, MultiSetEntry } from './multiset';

export interface SortedMultiSet<E> extends MultiSet<E> {
  firstEntry(): MultiSetEntry<E> | undefined;

  lastEntry(): MultiSetEntry<E> | undefined;

  first(): E | undefined;

  last(): E | undefined;

  reverseEntryIterator(): FluentIterator<MultiSetEntry<E>>;

  reverseIterator(): FluentIterator<E>;
}
