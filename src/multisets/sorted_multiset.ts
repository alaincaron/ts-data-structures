import { FluentIterator } from 'ts-fluent-iterators';
import { MutableMultiSet } from './mutable_multiset';
import { MutableMapEntry } from '../maps';

export interface SortedMultiSet<E> extends MutableMultiSet<E> {
  firstEntry(): MutableMapEntry<E, number> | undefined;

  lastEntry(): MutableMapEntry<E, number> | undefined;

  first(): E | undefined;

  last(): E | undefined;

  reverseEntryIterator(): FluentIterator<MutableMapEntry<E, number>>;

  reverseIterator(): FluentIterator<E>;

  clone(): SortedMultiSet<E>;
  clear(): SortedMultiSet<E>;
}
