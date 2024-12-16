import { CollectionInterface } from '../collections';

export interface SetInterface<E> extends CollectionInterface<E> {
  toSet(): Set<E>;
}
