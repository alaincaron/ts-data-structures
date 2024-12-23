import { Collection } from '../collections';

export interface MultiSet<E> extends Collection<E> {
  count(item: E): number;

  entries(): IterableIterator<[E, number]>;

  hashCode(): number;

  equals(other: unknown): boolean;

  clone(): MultiSet<E>;
}
