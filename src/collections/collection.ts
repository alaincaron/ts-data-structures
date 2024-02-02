import { FluentIterator, IteratorLike, Iterators, Mapper, Predicate, Reducer } from 'ts-fluent-iterators';
import { toIterator } from 'ts-fluent-iterators/dist/lib/sync';
import { getSize } from './helpers';
import { CollectionInitializer, CollectionLike } from './types';
import {
  CapacityMixin,
  ContainerOptions,
  equalsAny,
  iterableToJSON,
  OptionsBuilder,
  OverflowException,
} from '../utils';

/**
 * A `Collection` represents a group of objects, known as its
 * elements. Some collections allow duplicate elements and others do
 * not. Some are ordered and others unordered.
 */
export abstract class Collection<E> implements Iterable<E>, OptionsBuilder {
  public constructor(_options?: number | ContainerOptions) {}

  /**
   * Returns the number of elements in this `Collection`.
   * @returns the number of elements in this `Collection`
   */
  abstract size(): number;

  /**
   * Returns the capacity of this `Collection`, i.e. the maximum
   * number of elements it can contains.
   *
   * @returns The capacity of this `Collection`.
   */
  abstract capacity(): number;

  /**
   * Returns `true` if this `Collection` is empty, i.e. its `size` is `0`.
   * @returns `true` if this `Collection` is empty, `false` otherwise`.
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Returns `true` if this `Collection` is full, i.e. its `size` is
   * equal to its `capacity`.
   *
   * @returns `true` if this `Collection` is full, `false` otherwise.
   */
  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  /**
   * Returns the number of elements that can be added to this
   * `Collection` without exceeding its `capacity`.
   *
   * @returns the number of elements that can be added to this `Collection` without exceeding its `capacity`.
   */
  remaining(): number {
    return this.capacity() - this.size();
  }

  /**
   * Returns `true` if this `Collection` contains the specified
   * `item`.  The comparison is done using {@link equalsAny}.
   *
   * @param item The item whose presence is tested.
   *
   * @returns `true` if this `Collections contains the specified
   * `item`, `false` otherwise.
   */
  contains(item: E): boolean {
    return this.iterator().contains(x => equalsAny(item, x));
  }

  /**
   * Returns an array containing all elements of this `Collection`
   *
   * @returns an array containing all elements of this `Collection`
   */
  toArray(): E[] {
    return this.iterator().collect();
  }

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

  add(item: E) {
    if (!this.offer(item)) throw new OverflowException();
    return true;
  }

  /**
   * Inserts an element if possible, without exceeding the `capacity`
   * of this `Collection`.  Otherwise returning false.
   *
   * @param item the item to add to the `Collection`
   *
   * @returns `true` if the element can be added without exceeding the `capacity`, `false` otherwise.
   *
   */
  abstract offer(item: E): boolean;

  /**
   * Removes an item for which the `predicate` returns `true`.
   *
   * @param predicate The predicate that is being evaluated for each elements.
   *
   * @returns the element removed from the `Collection` or `undefined`
   * if there are no items for which the `predicate` evaluated to
   * `true`.
   */
  abstract removeMatchingItem(predicate: Predicate<E>): E | undefined;

  /**
   * Removes an instance of item from the `Collection`
   *
   * @param item The `item` to remove from the `Collection`
   *
   * @returns `true` if an element was removed from the `Collection`, `false` otherwise.
   *
   * @remarks The comparison for equality is made using the function {@link equalsAny}.
   */
  removeItem(item: E): boolean {
    return this.removeMatchingItem(x => equalsAny(item, x)) != null;
  }

  /**
   * Removes items from this `Collection` for which the argument
   * `predicate` evaluates to `false`.
   *
   * @param predicate the predicate used for filtering
   * item of this `Collection`.
   *
   * @returns the number of elements removed from this `Collection`
   */
  abstract filter(predicate: Predicate<E>): number;

  /**
   * Finds an item for which the argument `predicate` evaluates to `true`.
   *
   * @param predicate the predicate used to select an item
   *
   * @returns An item for which the `predicate` evaluates to `true` or
   * `undefined`
   */
  find(predicate: Predicate<E>): E | undefined {
    return this.iterator().filter(predicate).first();
  }

  /**
   * Returns `true` if the `predicate` evaluates to `true` for all items of this `Collection`
   *
   * @param predicate the predicate being evaluated
   *
   * @returns `true` if the `predicate` evaluates to true for all
   * items of this `Collection` or `false` otherwise
   */
  all(predicate: Predicate<E>) {
    return this.iterator().all(predicate);
  }

  /**
   * Returns `true` if the `predicate` evaluates to `true` for at least one item of this `Collection`
   *
   * @param predicate the predicate being evaluated
   *
   * @returns `true` if the `predicate` evaluates to true for at least
   * one item of this `Collection` or `false` otherwise
   */
  some(predicate: Predicate<E>) {
    return this.iterator().some(predicate);
  }

  /**
   * Applies the {@link Mapper | mapper} to each element of this `Collection`
   *
   * @param mapper the operation to be invoked on each element.
   * @remarks The results of invoking the `mapper` are ignored unless it throws.
   * @example
   * collection.forEach(console.log)
   */
  forEach(mapper: Mapper<E, any>) {
    this.iterator().forEach(mapper);
  }

  /**
   * Executes the `Reducer` function on each element
   * of this `Collection`, passing in
   * the return value from the calculation on the preceding element. The
   * final result of running the reducer across all elements of this `Collection`
   * is a single value.

   * @paramType B the type into which the elements are being folded to
   * @param reducer The reducer to be applied at each iteration.
   * @param initialValue The value of the accumulator to be used in the first call to `reducer`

   * @remarks
   * If the `Collection` is empty, `initialValue` is returned.
   *
   * @example
   * To compute the sum of elements of a collection:
   * ```
   * const col: Collection<number> =  ...
   * col.fold((acc, x) => acc + x, 0)
   * ```
   */
  fold<B>(reducer: Reducer<E, B>, initialValue: B): B {
    return this.iterator().fold(reducer, initialValue);
  }

  /**
   * Special case of {@link Collection.fold} where items being iterated on and the accumulator are of the same type.

   * @param reducer The reducer to be applied at each iteration.
   * @param initialValue The value of the accumulator to be used in the first call to `reducer`. If omitted, the first element of this `Collection` is used.

   * @remarks
   * If this `Collection` is empty, `initialValue` is returned.
   *
   * @example
   * To compute the sum of elements of a `Collection`:
   * ```
   * const col: Collection<number> = ....
   * col.reduce((acc, x) => acc + x)
   * ```
   */
  reduce(reducer: Reducer<E, E>, initialValue?: E): E | undefined {
    return this.iterator().reduce(reducer, initialValue);
  }

  /**
   * Adds all the items of the `container` to this `Collection` if
   * there is enough remaining capaacity.
   *
   * @param container The container of items to add.
   *
   * @returns The number of items added, which is the number of items
   * in the container.
   *
   * @throws Overflowexception if there remaining capacity of this
   * `Collection` is less than the number of items in the `container`.
   */
  addFully<E1 extends E>(container: CollectionLike<E1>): number {
    if (this.remaining() < getSize(container)) throw new OverflowException();
    return this.offerPartially(container);
  }

  offerFully<E1 extends E>(container: CollectionLike<E1>): number {
    if (this.remaining() < getSize(container)) return 0;
    return this.offerPartially(container);
  }

  /**
   * Adds as many items as possible of the `container` to this
   * `Collection` as long there is remaining capaacity.  Items are
   * added one by one until all items are added or the `Collection` is
   * {@link Collection.isFull | full}.
   *
   * @param container The container of items to add.
   *
   * @returns The number of items added
   *
   */
  offerPartially<E1 extends E>(container: IteratorLike<E1> | CollectionLike<E1>): number {
    let count = 0;
    const iter: Iterator<E1> = Iterators.toIterator(container);
    for (;;) {
      const item = iter.next();
      if (item.done || !this.offer(item.value)) break;
      ++count;
    }
    return count;
  }

  /**
   * Removes all elements from this `Collection`
   */
  abstract clear(): void;

  /**
   * Returns true if this `Collection` contains all of the elements in the specified `IteratorLike`.
   *
   * @param iteratorLike The items to be checked for containment in this `Collection`.
   *
   * @returns true if this collection contains all of the elements in the specified `IteratorLike`
   */
  containsAll<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean {
    const iter = toIterator(iteratorLike);
    for (;;) {
      const item = iter.next();
      if (item.done) return true;
      if (!this.contains(item.value)) return false;
    }
  }

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
  removeAll(c: Collection<E>): number {
    return this.filter(e => !c.contains(e));
  }

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
  retainAll(c: Collection<E>): number {
    return this.filter(e => c.contains(e));
  }

  /**
   * Used to make this {@link Collection} being seen as an
   * `Iterable<A>`. This allows them to be used in APIs expecting an
   * `Iterable<A>`
   */
  abstract [Symbol.iterator](): IterableIterator<E>;

  /**
   * Returns a `FluentIterator` (
   * https://github.com/alaincaron/ts-fluent-iterators/blob/main/docs/classes/FluentIterator.md)
   * yielding all elements of this `Collection`.
   *
   * @returns a `FluentIterator` yielding all elements of this `Collection`.
   */
  iterator() {
    return new FluentIterator(this[Symbol.iterator]());
  }

  /**
   * Returns a hashCode for this `Collection`
   */
  abstract hashCode(): number;

  /**
   * Returns true if this collection is equal to the specified argument `other`.
   */
  abstract equals(other: unknown): boolean;

  /** * Returns a clone of this `Collection`.
   *
   * The clone `Collection` will have the same elements and capacity
   as the original one and also all other settings returned by `{@link QSWCollection.buildOptions}.
   */
  abstract clone(): Collection<E>;

  /**
   * Returns the options used to build this `Collection`.  This is
   * used buildCollection to initialize the built `Collection` with
   * the same options as the source `Collection`, e.g. in clone
   * operation.
   */
  buildOptions(): ContainerOptions {
    return {};
  }

  /**
   * Returns a JSON string representation of this `Collection`.
   */
  toJson() {
    return iterableToJSON(this);
  }
}

/**
 * A Collection with a capacity.
 */
export const BoundedCollection = CapacityMixin(Collection);

/**
 * Builds a `Collection`
 */
export function buildCollection<
  E,
  C extends Collection<E>,
  Options extends ContainerOptions = ContainerOptions,
  Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
>(factory: new (...args: any[]) => C, initializer?: number | (Options & Initializer)): C {
  if (initializer == null || typeof initializer === 'number') return new factory(initializer);
  const initialElements = initializer.initial;

  let options: any = undefined;

  if (initialElements && 'buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
    options = { ...(initialElements.buildOptions() as Options), ...initializer };
  }
  if (!options) {
    options = { ...initializer };
  }
  delete options.initial;

  const result = new factory(options);
  if (initialElements) result.addFully(initialElements);
  return result;
}
