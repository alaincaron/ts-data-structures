import { FluentIterator } from 'ts-fluent-iterators';
import { MultiSetInterface } from './multi_set_interface';
import { MapEntry } from '../maps';

export interface SortedMultiSetInterface<E> extends MultiSetInterface<E> {
  firstEntry(): MapEntry<E, number> | undefined;

  lastEntry(): MapEntry<E, number> | undefined;

  first(): E | undefined;

  last(): E | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<E, number>>;

  reverseIterator(): FluentIterator<E>;

  clone(): SortedMultiSetInterface<E>;
  clear(): SortedMultiSetInterface<E>;
}
