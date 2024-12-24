import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export interface MultiSet<E> extends Collection<E> {
  count(item: E): number;

  nbKeys(): number;
  keys(): IterableIterator<E>;
  keyIterator(): FluentIterator<E>;
  entries(): IterableIterator<[E, number]>;
  entryIterator(): FluentIterator<[E, number]>;

  clone(): MultiSet<E>;
}
