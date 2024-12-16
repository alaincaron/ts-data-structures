import { SortedMultiSetInterface } from './sorted_multi_set_interface';
import { MapEntry } from '../maps';

export interface NavigableMultiSetInterface<E> extends SortedMultiSetInterface<E> {
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

  clone(): NavigableMultiSetInterface<E>;
  clear(): NavigableMultiSetInterface<E>;
}
