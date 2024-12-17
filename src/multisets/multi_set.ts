import { Collection, CollectionLike } from '../collections';

export type MultiSetLike<E> = CollectionLike<E> | MultiSet<E>;

export interface MultiSet<E> extends Collection<E> {
  count(item: E): number;

  clear(): MultiSet<E>;

  addCount(item: E, count: number): number;

  offerCount(item: E, count: number): number;

  removeCount(item: E, count: number): number;

  setCount(item: E, count: number): number;

  add(item: E): boolean;

  offer(item: E): boolean;

  removeItem(item: E): boolean;

  entries(): IterableIterator<[E, number]>;

  hashCode(): number;

  equals(other: unknown): boolean;

  clone(): MultiSet<E>;

  clear(): MultiSet<E>;
}
