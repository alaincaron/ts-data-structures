import { Comparator, Comparators, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyList } from '../lists';
import { ReadOnlyMultiSet } from '../multisets';
import { ReadOnlySet } from '../sets';
import { hashIterableOrdered, IndexOutOfBoundsException, Objects, parseArgs } from '../utils';

class EmptyCollection<T> implements ReadOnlyList<T>, ReadOnlySet<T>, ReadOnlyMultiSet<T> {
  private static readonly INSTANCE = new EmptyCollection<never>();
  private() {}

  static instance<T>() {
    return EmptyCollection.INSTANCE as EmptyCollection<T>;
  }

  protected checkBound(idx: number) {
    if (idx !== 0) throw new IndexOutOfBoundsException();
  }

  getAt(_: number): T {
    throw new IndexOutOfBoundsException();
  }

  getFirst(): T {
    throw new IndexOutOfBoundsException();
  }

  getLast(): T {
    throw new IndexOutOfBoundsException();
  }

  reverseIterator(): FluentIterator<T> {
    return FluentIterator.empty();
  }

  indexOfFirstOccurrence(_: Predicate<T>): number {
    return -1;
  }

  indexOf(_: T): number {
    return -1;
  }

  indexOfLastOccurrence(_: Predicate<T>): number {
    return -1;
  }

  lastIndexOf(_: T): number {
    return -1;
  }

  isOrdered(): boolean;
  isOrdered(arg1: number | Comparator<T> | undefined): boolean;
  isOrdered(arg1: number, arg2: number | Comparator<T> | undefined): boolean;
  isOrdered(arg1: number, arg2: number, arg3: Comparator<T> | undefined): boolean;
  isOrdered(
    arg1?: number | Comparator<T> | undefined,
    arg2?: number | Comparator<T> | undefined,
    arg3?: Comparator<T> | undefined
  ): boolean;
  isOrdered(arg1?: number | Comparator<T>, arg2?: number | Comparator<T>, arg3?: Comparator<T>) {
    const { left, right } = parseArgs(0, arg1, arg2, arg3, Comparators.natural);
    this.checkBound(left);
    this.checkBound(right);
    return true;
  }

  isStrictlyOrdered(): boolean;
  isStrictlyOrdered(arg1: number | Comparator<T> | undefined): boolean;
  isStrictlyOrdered(arg1: number, arg2: number | Comparator<T> | undefined): boolean;
  isStrictlyOrdered(arg1: number, arg2: number, arg3: Comparator<T> | undefined): boolean;
  isStrictlyOrdered(
    arg1?: number | Comparator<T> | undefined,
    arg2?: number | Comparator<T> | undefined,
    arg3?: Comparator<T> | undefined
  ): boolean;
  isStrictlyOrdered(arg1?: number | Comparator<T>, arg2?: number | Comparator<T>, arg3?: Comparator<T>) {
    return this.isOrdered(arg1, arg2, arg3);
  }

  clone(): EmptyCollection<T> {
    return this;
  }

  contains(_: T): boolean {
    return false;
  }

  includes(_: T): boolean {
    return false;
  }

  toArray(): T[] {
    return [];
  }

  find(_: Predicate<T>): T | undefined {
    return undefined;
  }

  containsAll<E1 extends T>(_: IteratorLike<E1>): boolean {
    return false;
  }

  disjoint<E1 extends T>(_: IteratorLike<E1>): boolean {
    return true;
  }

  iterator(): FluentIterator<T> {
    return FluentIterator.empty();
  }

  hashCode(): number {
    return hashIterableOrdered(this);
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    if (!other) return false;
    if (!Objects.hasFunction(other, 'isEmpty')) return false;
    return (other as ReadOnlyList<T>).isEmpty();
  }

  *[Symbol.iterator](): Iterator<T> {}

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

  toSet() {
    return new Set<T>();
  }

  count(_: T) {
    return 0;
  }

  *entries() {}
}

export function emptyCollection<T>() {
  return EmptyCollection.instance<T>();
}
