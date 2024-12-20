import { ReadOnlyMultiSet } from './readonly_multiset';
import { Collection } from '../collections';

export interface MultiSet<E> extends ReadOnlyMultiSet<E>, Collection<E> {
  addCount(item: E, count: number): number;

  offerCount(item: E, count: number): number;

  removeCount(item: E, count: number): number;

  setCount(item: E, count: number): number;

  clone(): MultiSet<E>;

  clear(): MultiSet<E>;
}
