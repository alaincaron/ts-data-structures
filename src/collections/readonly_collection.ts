import { FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Container } from '../utils';

export interface ReadOnlyCollection<E> extends Iterable<E>, Container {
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
   * Finds an item for which the argument `predicate` evaluates to `true`.
   *
   * @param predicate the predicate used to select an item
   *
   * @returns An item for which the `predicate` evaluates to `true` or
   * `undefined`
   */
  find(predicate: Predicate<E>): E | undefined;

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
   * Returns a `FluentIterator` (
   * https://github.com/alaincaron/ts-fluent-iterators/blob/main/docs/classes/FluentIterator.md)
   * yielding all elements of this `Collection`.
   *
   * @returns a `FluentIterator` yielding all elements of this `Collection`.
   */
  iterator(): FluentIterator<E>;

  hashCode(): number;

  equals(other: unknown): boolean;
}
