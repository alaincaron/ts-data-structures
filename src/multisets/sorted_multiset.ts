import { FluentIterator } from 'ts-fluent-iterators';
import { MultiSet } from './multiset';
import { MapEntry } from '../maps';

export interface SortedMultiSet<E> extends MultiSet<E> {
  firstEntry(): MapEntry<E, number> | undefined;

  lastEntry(): MapEntry<E, number> | undefined;

  first(): E | undefined;

  last(): E | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<E, number>>;

  reverseIterator(): FluentIterator<E>;

  clone(): SortedMultiSet<E>;
  clear(): SortedMultiSet<E>;
}
