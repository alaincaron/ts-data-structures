import { SortedMultiSet } from './sorted_multiset';
import { MutableMapEntry } from '../maps';

export interface NavigableMultiSet<E> extends SortedMultiSet<E> {
  lower(key: E): E | undefined;

  lowerEntry(key: E): MutableMapEntry<E, number> | undefined;

  higher(key: E): E | undefined;

  higherEntry(key: E): MutableMapEntry<E, number> | undefined;

  floor(key: E): E | undefined;

  floorEntry(key: E): MutableMapEntry<E, number> | undefined;

  ceiling(key: E): E | undefined;

  ceilingEntry(key: E): MutableMapEntry<E, number> | undefined;

  pollFirstEntry(): MutableMapEntry<E, number> | undefined;

  pollLastEntry(): MutableMapEntry<E, number> | undefined;

  pollFirst(): E | undefined;

  pollLast(): E | undefined;

  clone(): NavigableMultiSet<E>;
  clear(): NavigableMultiSet<E>;
}
