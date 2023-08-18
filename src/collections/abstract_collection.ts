import { Collection } from './collection';
import { EqualFunction, OverflowException, Predicate, equalPredicate } from '../utils';
import { CollectionOptions, CollectionInitializer, ArrayLike, toIterator } from './types';

export abstract class AbstractCollection<E> implements Collection<E> {
  private readonly _capacity: number;
  private readonly equals: EqualFunction<E>;

  constructor(options?: number | CollectionOptions<E>) {
    let capacity;
    let equals;

    if (typeof options === 'number') {
      capacity = options;
    } else {
      capacity = options?.capacity;
      equals = options?.equals;
    }
    this._capacity = capacity ?? Infinity;
    this.equals = equals ?? equalPredicate;
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
      if (this.equals(item, e)) return true;
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

  abstract add(item: E): void;
  abstract removeMatchingItem(predicate: Predicate<E>): E | undefined;

  removeItem(item: E): boolean {
    return this.removeMatchingItem(x => this.equals(x, item)) != null;
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

  addFully<E1 extends E>(items: E1[] | Collection<E1>): number {
    const itemsToAdd = Array.isArray(items) ? items.length : items.size();
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    return this.addPartially(items);
  }

  addPartially<E1 extends E>(iter: Iterable<E1>): number {
    let count = 0;
    for (const e of iter) {
      this.add(e);
      ++count;
    }
    return count;
  }

  abstract clear(): void;

  abstract [Symbol.iterator](): Iterator<E>;
  abstract iterator(): IterableIterator<E>;

  abstract clone(): Collection<E>;

  buildOptions(): CollectionOptions<E> {
    return {
      capacity: this._capacity,
      equals: this.equals,
    };
  }

  static buildCollection<
    E,
    Initializer extends CollectionInitializer<E>,
    C extends Collection<E>,
    Options extends CollectionOptions<E>,
  >(factory: (options: Options) => C, initializer: Initializer): C {
    const initialElements = initializer.initial;
    const options =
      initialElements instanceof AbstractCollection
        ? { ...initialElements.buildOptions(), ...initializer }
        : { ...initializer };
    const result = factory(options as unknown as Options);

    let iterator: Iterator<E>;
    if (Array.isArray(initialElements)) {
      iterator = initialElements[Symbol.iterator]();
    } else if (typeof (initialElements as any).iterator === 'function') {
      iterator = (initialElements as Collection<E>).iterator();
    } else {
      iterator = toIterator(initialElements as unknown as ArrayLike<E>);
    }

    for (;;) {
      const item = iterator.next();
      if (item.done) break;
      result.add(item.value);
    }

    return result;
  }
}
