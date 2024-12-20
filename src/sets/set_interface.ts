import { Collection, ReadOnlyCollection } from '../collections';

export interface ReadOnlySet<E> extends ReadOnlyCollection<E> {
  toSet(): Set<E>;
  clone(): ReadOnlySet<E>;
}

export interface ISet<E> extends Collection<E>, ReadOnlySet<E> {
  clone(): ISet<E>;
}
