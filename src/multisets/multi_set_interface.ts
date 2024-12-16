import { CollectionInterface, CollectionLike } from '../collections';

export type MultiSetLike<E> = CollectionLike<E> | MultiSetInterface<E>;

export interface MultiSetInterface<E> extends CollectionInterface<E> {
  count(item: E): number;

  clear(): MultiSetInterface<E>;

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

  clone(): MultiSetInterface<E>;

  clear(): MultiSetInterface<E>;
}
