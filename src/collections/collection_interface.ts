import { FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { CollectionLike } from './types';
import { ContainerInterface } from '../utils';

export interface CollectionInterface<E> extends Iterable<E>, ContainerInterface {
  /**
   * Returns `true` if this `Collection` contains the specified
   * `item`.  The comparison is done using {@link equalsAny}.
   *
   * @param item The item whose presence is tested.
   *
   * @returns `true` if this `Collections contains the specified
   * `item`, `false` otherwise.
   */
  contains(item: E): boolean;

  /**
   * Returns `true` if this `Collection` contains the specified
   * `item`.  The comparison is done using identify operator (`===`)/
   *
   * @param item The item whose presence is tested.
   *
   * @returns `true` if this `Collections contains the specified
   * `item`, `false` otherwise.
   */
  includes(item: E): boolean;

  /**
   * Returns an array containing all elements of this `Collection`
   *
   * @returns an array containing all elements of this `Collection`
   */
  toArray(): E[];

  /**
   * Ensures that this `Collection` contains the specified element.
   * Returns `true` if this `Collection` changed as a result of the
   * call.  Returns false if this `Collection` does not allow
   * duplicates and already contains the specified element.
   *
   * @param item the item whose presence in the `Collection` is to be ensured
   *
   * @returns true if this collection changed as a result of the call.
   *
   * @throws Overflowexception if the capacity of the `Collection`
   * would be exceeded by adding this element.
   */
  add(item: E): boolean;

  offer(item: E): boolean;

  removeMatchingItem(predicate: Predicate<E>): E | undefined;

  /**
   * Removes an instance of item from the `Collection`
   *
   * @param item The `item` to remove from the `Collection`
   *
   * @returns `true` if an element was removed from the `Collection`, `false` otherwise.
   *
   * @remarks The comparison for equality is made using the function {@link equalsAny}.
   */
  removeItem(item: E): boolean;

  filter(predicate: Predicate<E>): number;

  /**
   * Finds an item for which the argument `predicate` evaluates to `true`.
   *
   * @param predicate the predicate used to select an item
   *
   * @returns An item for which the `predicate` evaluates to `true` or
   * `undefined`
   */
  find(predicate: Predicate<E>): E | undefined;

  /**
   * Adds all the items of the `container` to this `Collection` if
   * there is enough remaining capacity.
   *
   * @param container The container of items to add.
   *
   * @returns The number of items added, which is the number of items
   * in the container.
   *
   * @throws Overflowexception if there remaining capacity of this
   * `Collection` is less than the number of items in the `container`.
   */
  addFully<E1 extends E>(container: CollectionLike<E1>): number;

  offerFully<E1 extends E>(container: CollectionLike<E1>): number;

  /**
   * Adds as many items as possible of the `container` to this
   * `Collection` as long there is remaining capacity.  Items are
   * added one by one until all items are added or the `Collection` is
   * {@link Collection.isFull | full}.
   *
   * @param container The container of items to add.
   *
   * @returns The number of items added
   *
   */
  offerPartially<E1 extends E>(container: IteratorLike<E1> | CollectionLike<E1>): number;

  clear(): CollectionInterface<E>;

  /**
   * Returns true if this `Collection` contains all the elements in the specified `IteratorLike`.
   *
   * @param iteratorLike The items to be checked for containment in this `Collection`.
   *
   * @returns true if this collection contains all the elements in the specified `IteratorLike`
   */
  containsAll<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean;

  disjoint<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean;

  /**
   * Removes all of this collection's elements that are also contained
   * in the specified `Collection`. After this call returns, this
   * `Collection` will contain no elements in common with the
   * specified `Collection`.
   *
   * @param c `Collection` containing elements to be removed from this `Collection`.
   *
   * @returns The number of elements that were removed as a result of this call.
   */
  removeAll(c: CollectionInterface<E>): number;

  /**
   * Retains only the elements in this `Collection` that are contained
   * in the specified `Collection`. In other words, removes from this
   * `Collection all of its elements that are not contained in the
   * specified `Collection`.
   *
   * @param c `Collection` containing elements to be retained in this `Collection`.
   *
   * @returns The number of elements that were removed as a result of this call.
   */
  retainAll(c: CollectionInterface<E>): number;

  /**
   * Returns a `FluentIterator` (
   * https://github.com/alaincaron/ts-fluent-iterators/blob/main/docs/classes/FluentIterator.md)
   * yielding all elements of this `Collection`.
   *
   * @returns a `FluentIterator` yielding all elements of this `Collection`.
   */
  iterator(): FluentIterator<unknown>;

  hashCode(): number;

  clone(): CollectionInterface<E>;
}
