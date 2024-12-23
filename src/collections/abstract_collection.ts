import { Constructor, FluentIterator, IteratorLike, Iterators, Predicate } from 'ts-fluent-iterators';
import { Collection, CollectionInitializer, CollectionLike } from './collection';
import { MutableCollection } from './mutable_collection';
import {
  AbstractContainer,
  CapacityMixin,
  ContainerOptions,
  equalsAny,
  extractOptions,
  getSize,
  iterableToJSON,
  OverflowException,
  WithCapacity,
} from '../utils';

/**
 * A `Collection` represents a group of objects, known as its
 * elements. Some collections allow duplicate elements and others do
 * not. Some are ordered and others unordered.
 */
export abstract class AbstractCollection<E> extends AbstractContainer implements MutableCollection<E> {
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
   * Returns `true` if this `Collection` contains the specified
   * `item`.  The comparison is done using identify operator (`===`)/
   *
   * @param item The item whose presence is tested.
   *
   * @returns `true` if this `Collections contains the specified
   * `item`, `false` otherwise.
   */
  includes(item: E): boolean {
    return this.iterator().includes(item);
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
   * of this `Collection`, otherwise returning false.
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
   * @param predicate The predicate that is being evaluated for each element.
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
   * `Collection` as long there is remaining capacity.  Items are
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
   *
   @ @returns This collection.
   */
  abstract clear(): AbstractCollection<E>;

  /**
   * Returns true if this `Collection` contains all the elements in the specified `IteratorLike`.
   *
   * @param iteratorLike The items to be checked for containment in this `Collection`.
   *
   * @returns true if this collection contains all the elements in the specified `IteratorLike`
   */
  containsAll<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean {
    return FluentIterator.from(iteratorLike).all(x => this.contains(x));
  }

  disjoint<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean {
    return FluentIterator.from(iteratorLike).all(x => !this.contains(x));
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
   * Used to make this {@link MutableCollection} being seen as an
   * `Iterable<A>`. This allows them to be used in APIs expecting an
   * `Iterable<A>`
   */
  abstract [Symbol.iterator](): Iterator<E>;

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
   as the original one and also all other settings returned by `{@link Collection.buildOptions}.
   */
  abstract clone(): AbstractCollection<E>;

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
  toJSON() {
    return iterableToJSON(this);
  }
}

/**
 * Builds a `Collection`
 */
export function buildCollection<
  E,
  C extends MutableCollection<E>,
  Options extends object = object,
  Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
>(factory: Constructor<C, [Options | undefined]>, initializer?: WithCapacity<Options & Initializer>): C {
  const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);

  const result = boundCollection(factory, options);
  if (initialElements) result.addFully(initialElements);
  return result;
}

const constructorMap = new Map();

export function boundCollection<E, C extends MutableCollection<E>, Options extends ContainerOptions = ContainerOptions>(
  ctor: Constructor<C, [Options | undefined]>,
  options?: Options
): C {
  if (options && 'capacity' in options) {
    let boundedCtor = constructorMap.get(ctor);
    if (!boundedCtor) {
      boundedCtor = CapacityMixin(ctor);
      constructorMap.set(ctor, boundedCtor);
    }
    return new boundedCtor(options);
  }
  return new ctor(options);
}
