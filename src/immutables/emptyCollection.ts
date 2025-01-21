import { FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { hashIterableOrdered } from '../utils';

export abstract class EmptyCollection<E> implements Collection<E> {
  protected constructor() {}

  clone() {
    return this;
  }

  contains(_: E) {
    return false;
  }

  includes(_: E) {
    return false;
  }

  toArray() {
    return [];
  }

  find(_: Predicate<E>) {
    return undefined;
  }

  containsAll<E1 extends E>(_: IteratorLike<E1>) {
    return false;
  }

  disjoint<E1 extends E>(_: IteratorLike<E1>) {
    return true;
  }

  iterator() {
    return FluentIterator.empty();
  }

  hashCode() {
    return hashIterableOrdered(this);
  }

  *[Symbol.iterator](): Iterator<E> {}

  size() {
    return 0;
  }

  capacity() {
    return 0;
  }

  isEmpty() {
    return true;
  }

  isFull() {
    return true;
  }

  remaining() {
    return 0;
  }

  toJSON() {
    return '[]';
  }

  abstract equals(other: unknown): boolean;

  toReadOnly() {
    return this;
  }

  asReadOnly() {
    return this;
  }
}
