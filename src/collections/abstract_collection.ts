import { FluentIterator, IteratorLike, Iterators, Mapper, Predicate, Reducer } from 'ts-fluent-iterators';
import { Collection } from './collection';
import { CollectionInitializer, CollectionLike, getSize } from './types';
import {
  CapacityMixin,
  ContainerOptions,
  equalsAny,
  iterableToJSON,
  OptionsBuilder,
  OverflowException,
} from '../utils';

export abstract class AbstractCollection<E> implements Collection<E>, OptionsBuilder {
  public constructor(_options?: number | ContainerOptions) {}

  abstract size(): number;
  abstract capacity(): number;

  isEmpty(): boolean {
    return this.size() === 0;
  }

  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  remaining(): number {
    return this.capacity() - this.size();
  }

  contains(item: E): boolean {
    return this.iterator().contains(x => equalsAny(item, x));
  }

  toArray(): E[] {
    return this.iterator().collect();
  }

  add(item: E) {
    if (!this.offer(item)) throw new OverflowException();
    return true;
  }

  abstract offer(item: E): boolean;

  abstract removeMatchingItem(predicate: Predicate<E>): E | undefined;

  removeItem(item: E): boolean {
    return this.removeMatchingItem(x => equalsAny(item, x)) != null;
  }

  abstract filter(predicate: Predicate<E>): number;

  find(predicate: Predicate<E>): E | undefined {
    return this.iterator().first(predicate);
  }

  all(predicate: Predicate<E>) {
    return this.iterator().all(predicate);
  }

  some(predicate: Predicate<E>) {
    return this.iterator().some(predicate);
  }

  forEach(f: Mapper<E, any>) {
    this.iterator().forEach(f);
  }

  fold<B>(reducer: Reducer<E, B>, initialValue: B): B {
    return this.iterator().fold(reducer, initialValue);
  }

  reduce(reducer: Reducer<E, E>, initialValue?: E): E | undefined {
    return this.iterator().reduce(reducer, initialValue);
  }

  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    return this.addPartially(items);
  }

  addPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    let count = 0;
    const iter: Iterator<E1> = Iterators.toIterator(items);
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      if (this.add(item.value)) ++count;
    }
    return count;
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    if (this.remaining() < itemsToAdd) return 0;
    return this.offerPartially(items);
  }

  offerPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    let count = 0;
    const iter: Iterator<E1> = Iterators.toIterator(items);
    for (;;) {
      const item = iter.next();
      if (item.done || !this.offer(item.value)) break;
      ++count;
    }
    return count;
  }

  abstract clear(): void;

  containsAll<E1 extends E>(c: Iterable<E1>): boolean {
    for (const item of c) {
      if (!this.contains(item)) return false;
    }
    return true;
  }

  removeAll(c: Collection<E>): number {
    return this.filter(e => !c.contains(e));
  }

  retainAll(c: Collection<E>): number {
    return this.filter(e => c.contains(e));
  }

  abstract [Symbol.iterator](): Iterator<E>;

  iterator() {
    return new FluentIterator(this[Symbol.iterator]());
  }

  abstract hashCode(): number;
  abstract equals(other: unknown): boolean;

  abstract clone(): AbstractCollection<E>;

  buildOptions(): ContainerOptions {
    return {};
  }

  toJson() {
    return iterableToJSON(this);
  }
}

export const BoundedCollection = CapacityMixin(AbstractCollection);

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
    options = { ...(initialElements.buildOptions() as ContainerOptions), ...initializer };
  }
  if (!options) {
    options = { ...initializer };
  }
  delete options.initial;

  const result = new factory(options);
  if (initialElements) result.addFully(initialElements);
  return result;
}
