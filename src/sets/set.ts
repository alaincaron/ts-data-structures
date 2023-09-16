import { Collection } from '../collections';

export interface ISet<E = any> extends Collection<E> {
  toSet(): Set<E>;
}
