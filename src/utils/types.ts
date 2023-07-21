import { IMap } from '../maps';

export type Predicate<E> = (item: E) => boolean;
export type Comparator<E> = (a: E, b: E) => number;
export type HashFunction<E> = (e: E) => number;
export type EqualFunction<E> = (e1: E, e2: E) => boolean;

export interface MapOptions<K, V> {
  capacity?: number;
  initial?: Map<K, V> | IMap<K, V>;
  equalK?: (k1: K, k2: K) => boolean;
  equalV?: (v1: V, v2: V) => boolean;
}
