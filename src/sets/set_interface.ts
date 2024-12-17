import { Collection } from '../collections';

export interface ISet<E> extends Collection<E> {
  toSet(): Set<E>;
}
