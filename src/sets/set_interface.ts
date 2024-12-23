import { Collection, MutableCollection } from '../collections';

export interface ISet<E> extends Collection<E> {
  toSet(): Set<E>;
  clone(): ISet<E>;
}

export interface MutableSet<E> extends MutableCollection<E>, ISet<E> {
  clone(): MutableSet<E>;
}
