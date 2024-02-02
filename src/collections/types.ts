import { ArrayGenerator } from 'ts-fluent-iterators';
import { Collection } from './collection';

/**
 * Describes an object that can behave like a Collection.  It has a
 * `size` or `length` and it is possible to iterate through its
 * elements.
 */
export type CollectionLike<E> = Set<E> | Array<E> | Collection<E> | ArrayGenerator<E>;

/**
 * Interface used to specify initial elements in a create method for a {@link Collection}.
 */
export interface CollectionInitializer<E> {
  /**
   * Specifiy initial elements of the collection.
   */
  initial?: CollectionLike<E>;
}
