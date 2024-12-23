import { MultiSet } from './multiset';
import { MutableCollection } from '../collections';

export interface MutableMultiSet<E> extends MultiSet<E>, MutableCollection<E> {
  addCount(item: E, count: number): number;

  offerCount(item: E, count: number): number;

  removeCount(item: E, count: number): number;

  setCount(item: E, count: number): number;

  clone(): MutableMultiSet<E>;

  clear(): MutableMultiSet<E>;
}
