import { MultiSetEntry } from './multiset';
import { SortedMultiSet } from './sorted_multiset';

export interface NavigableMultiSet<E> extends SortedMultiSet<E> {
  lower(key: E): E | undefined;

  lowerEntry(key: E): MultiSetEntry<E> | undefined;

  higher(key: E): E | undefined;

  higherEntry(key: E): MultiSetEntry<E> | undefined;

  floor(key: E): E | undefined;

  floorEntry(key: E): MultiSetEntry<E> | undefined;

  ceiling(key: E): E | undefined;

  ceilingEntry(key: E): MultiSetEntry<E> | undefined;

  clone(): NavigableMultiSet<E>;
}
