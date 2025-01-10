import { FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { hashIterableOrdered } from '../utils';

export abstract class EmptyCollection<E> implements Collection<E> {
  protected constructor() {}

  abstract clone(): EmptyCollection<E>;

  contains(_: E): boolean {
    return false;
  }

  includes(_: E): boolean {
    return false;
  }

  toArray(): E[] {
    return [];
  }

  find(_: Predicate<E>): E | undefined {
    return undefined;
  }

  containsAll<E1 extends E>(_: IteratorLike<E1>): boolean {
    return false;
  }

  disjoint<E1 extends E>(_: IteratorLike<E1>): boolean {
    return true;
  }

  iterator(): FluentIterator<E> {
    return FluentIterator.empty();
  }

  hashCode(): number {
    return hashIterableOrdered(this);
  }

  *[Symbol.iterator](): Iterator<E> {}

  size(): number {
    return 0;
  }

  capacity(): number {
    return 0;
  }

  isEmpty(): boolean {
    return true;
  }

  isFull(): boolean {
    return true;
  }

  remaining(): number {
    return 0;
  }

  toJSON(): string {
    return '[]';
  }

  abstract equals(other: unknown): boolean;
  abstract toReadOnly(): Collection<E>;
  abstract asReadOnly(): Collection<E>;
}
