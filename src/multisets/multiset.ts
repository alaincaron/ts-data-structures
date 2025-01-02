import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export interface MultiSetEntry<E> {
  key: E;
  count: number;
}

export interface MultiSet<E> extends Collection<E> {
  count(item: E): number;

  nbKeys(): number;
  keys(): IterableIterator<E>;
  keyIterator(): FluentIterator<E>;
  entries(): IterableIterator<MultiSetEntry<E>>;
  entryIterator(): FluentIterator<MultiSetEntry<E>>;

  clone(): MultiSet<E>;
}
