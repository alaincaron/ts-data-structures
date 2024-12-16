import { ArrayGenerator } from 'ts-fluent-iterators';
import { ContainerInitializer } from '../utils';

type Length = number | (() => number);

/**
 * Describes an object that can behave like a Collection.  It has a
 * `size` or `length` and it is possible to iterate through its
 * elements.
 */
export type CollectionLike<E> =
  | (Iterable<E> &
      (
        | {
            length: Length;
          }
        | { size: Length }
      ))
  | ArrayGenerator<E>;

/**
 * Interface used to specify initial elements in a create method for a {@link Collection}.
 */
export type CollectionInitializer<E> = ContainerInitializer<CollectionLike<E>>;
