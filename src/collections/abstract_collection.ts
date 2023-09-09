import { Collection } from './collection';
import { OverflowException, Predicate, IteratorLike, Reducer, iterableToJSON, toIterator } from '../utils';
import { CollectionOptions, CollectionInitializer, CollectionLike, getSize } from './types';

export abstract class AbstractCollection<E> implements Collection<E> {
  private readonly _capacity: number;

  protected constructor(options?: number | CollectionOptions) {
    const capacity = typeof options === 'number' ? options : options?.capacity;
    this._capacity = capacity ?? Infinity;
  }

  abstract size(): number;

  isEmpty(): boolean {
    return this.size() === 0;
  }

  capacity() {
    return this._capacity;
  }

  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  remaining(): number {
    return this.capacity() - this.size();
  }

  contains(item: E): boolean {
    for (const e of this) {
      if (item === e) return true;
    }
    return false;
  }

  toArray(): E[] {
    const result = [];
    for (const e of this) {
      result.push(e);
    }
    return result;
  }

  add(item: E) {
    if (!this.offer(item)) throw new OverflowException();
    return true;
  }

  abstract offer(item: E): boolean;

  abstract removeMatchingItem(predicate: Predicate<E>): E | undefined;

  removeItem(item: E): boolean {
    return this.removeMatchingItem(x => x === item) != null;
  }

  abstract filter(predicate: Predicate<E>): boolean;

  find(predicate: Predicate<E>): E | undefined {
    for (const e of this) {
      if (predicate(e)) return e;
    }
    return undefined;
  }

  all(predicate: Predicate<E>) {
    for (const e of this) {
      if (!predicate(e)) return false;
    }
    return true;
  }

  some(predicate: Predicate<E>) {
    for (const e of this) {
      if (predicate(e)) return true;
    }
    return false;
  }

  forEach(f: (e: E) => void) {
    for (const e of this) {
      f(e);
    }
  }

  fold<B>(reducer: Reducer<E, B>, initialValue: B): B {
    let acc = initialValue;
    for (const e of this) {
      acc = reducer(acc, e);
    }
    return acc;
  }

  reduce(reducer: Reducer<E, E>, initialValue?: E): E | undefined {
    const iter = this[Symbol.iterator]();
    let acc = initialValue;
    if (acc === undefined) {
      const item = iter.next();
      if (item.done) return undefined;
      acc = item.value;
    }
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      acc = reducer(acc, item.value);
    }
    return acc;
  }

  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    return this.addPartially(items);
  }

  addPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    let count = 0;
    const iter = toIterator(items);
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      this.add(item.value);
      ++count;
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
    const iter = toIterator(items);
    for (;;) {
      const item = iter.next();
      if (item.done || !this.offer(item.value)) break;
      ++count;
    }
    return count;
  }

  abstract clear(): void;

  abstract [Symbol.iterator](): Iterator<E>;
  abstract iterator(): IterableIterator<E>;

  abstract clone(): Collection<E>;

  buildOptions(): CollectionOptions {
    return {
      capacity: this._capacity,
    };
  }

  toJson() {
    return iterableToJSON(this);
  }

  static buildCollection<
    E,
    C extends Collection<E>,
    Options extends CollectionOptions,
    Initializer extends CollectionInitializer<E>,
  >(factory: (options?: number | Options) => C, initializer?: number | (Options & Initializer)): C {
    if (initializer == null || typeof initializer === 'number') return factory(initializer);
    const initialElements = initializer.initial;

    let options: any = undefined;

    if (initialElements) {
      let initialCol = initialElements as Collection<E>;
      let buildOptionsF = initialCol.buildOptions;
      if (typeof buildOptionsF === 'function') {
        options = { ...initialCol.buildOptions(), ...initializer };
      }
    }
    if (!options) {
      options = { ...initializer };
    }
    delete options.initial;

    const result = factory(options);
    if (initialElements) result.addFully(initialElements);
    return result;
  }
}
