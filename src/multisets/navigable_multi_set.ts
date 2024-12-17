import { SortedMultiSet } from './sorted_multi_set';
import { MapEntry } from '../maps';

export interface NavigableMultiSet<E> extends SortedMultiSet<E> {
  lower(key: E): E | undefined;

  lowerEntry(key: E): MapEntry<E, number> | undefined;

  higher(key: E): E | undefined;

  higherEntry(key: E): MapEntry<E, number> | undefined;

  floor(key: E): E | undefined;

  floorEntry(key: E): MapEntry<E, number> | undefined;

  ceiling(key: E): E | undefined;

  ceilingEntry(key: E): MapEntry<E, number> | undefined;

  pollFirstEntry(): MapEntry<E, number> | undefined;

  pollLastEntry(): MapEntry<E, number> | undefined;

  pollFirst(): E | undefined;

  pollLast(): E | undefined;

  clone(): NavigableMultiSet<E>;
  clear(): NavigableMultiSet<E>;
}
