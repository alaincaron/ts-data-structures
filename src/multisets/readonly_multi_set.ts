import { ReadOnlyCollection } from '../collections';

export interface ReadOnlyMultiSet<E> extends ReadOnlyCollection<E> {
  count(item: E): number;

  entries(): IterableIterator<[E, number]>;

  hashCode(): number;

  equals(other: unknown): boolean;
}
