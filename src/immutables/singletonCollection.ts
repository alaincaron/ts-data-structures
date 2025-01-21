import { FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { equalsAny, hashIterableOrdered, iterableToJSON } from '../utils';

export abstract class SingletonCollection<E> implements Collection<E> {
  protected constructor(protected readonly item: E) {}

  clone(): this {
    return this;
  }

  contains(item: E): boolean {
    return equalsAny(item, this.item);
  }

  includes(item: E): boolean {
    return item === this.item;
  }

  toArray(): E[] {
    return [this.item];
  }

  toReadOnly(): this {
    return this;
  }

  asReadOnly(): this {
    return this;
  }

  find(predicate: Predicate<E>): E | undefined {
    return predicate(this.item) ? this.item : undefined;
  }

  containsAll<E1 extends E>(iter: IteratorLike<E1>): boolean {
    return FluentIterator.from(iter).all(x => equalsAny(x, this.item));
  }

  disjoint<E1 extends E>(iter: IteratorLike<E1>): boolean {
    return FluentIterator.from(iter).all(x => !equalsAny(x, this.item));
  }

  iterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  hashCode(): number {
    return hashIterableOrdered(this);
  }

  abstract equals(other: unknown): boolean;

  *[Symbol.iterator](): Iterator<E> {
    yield this.item;
  }

  size(): number {
    return 1;
  }

  capacity(): number {
    return 1;
  }

  isEmpty(): boolean {
    return false;
  }

  isFull(): boolean {
    return true;
  }

  remaining(): number {
    return 0;
  }

  toJSON(): string {
    return iterableToJSON(this);
  }
}
