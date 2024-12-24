import { Collector, Comparator, Comparators, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { MutableCollection } from '../collections';
import { List } from '../lists';
import { MultiSet } from '../multisets';
import { ISet } from '../sets';
import { hashIterableOrdered, IndexOutOfBoundsException, Objects, parseArgs } from '../utils';

class EmptyCollection<E> implements List<E>, ISet<E>, MultiSet<E> {
  private static readonly INSTANCE = new EmptyCollection<never>();

  private constructor() {}

  static instance<E>() {
    return EmptyCollection.INSTANCE as EmptyCollection<E>;
  }

  getAt(_: number): E {
    throw new IndexOutOfBoundsException();
  }

  getFirst(): E {
    throw new IndexOutOfBoundsException();
  }

  getLast(): E {
    throw new IndexOutOfBoundsException();
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.empty();
  }

  indexOfFirstOccurrence(_: Predicate<E>): number {
    return -1;
  }

  indexOf(_: E): number {
    return -1;
  }

  indexOfLastOccurrence(_: Predicate<E>): number {
    return -1;
  }

  lastIndexOf(_: E): number {
    return -1;
  }

  peekFirst(): E | undefined {
    return undefined;
  }

  peekLast(): E | undefined {
    return undefined;
  }

  isOrdered(): boolean;
  isOrdered(arg1: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;
  isOrdered(
    arg1?: number | Comparator<E> | undefined,
    arg2?: number | Comparator<E> | undefined,
    arg3?: Comparator<E> | undefined
  ): boolean;
  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    const { left, right } = parseArgs(0, arg1, arg2, arg3, Comparators.natural);
    if (left !== 0 || right !== 0) throw new IndexOutOfBoundsException();
    return true;
  }

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    return this.isOrdered(arg1, arg2, arg3);
  }

  clone(): EmptyCollection<E> {
    return this;
  }

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

  listIterator(skip?: number, count?: number): FluentIterator<E> {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  reverseListIterator(skip?: number, count?: number): FluentIterator<E> {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    if (!other) return false;
    if (!Objects.hasFunction(other, 'isEmpty')) return false;
    return (other as List<E>).isEmpty();
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

  toSet() {
    return new Set<E>();
  }

  count(_: E) {
    return 0;
  }

  *entries() {}

  toCollector<R>(c: Collector<E, R>): R {
    return c.result;
  }

  toCollection<C extends MutableCollection<E>>(c: C): C {
    return c;
  }

  toReadOnly() {
    return this;
  }

  asReadOnly() {
    return this;
  }

  entryIterator(): FluentIterator<[E, number]> {
    return FluentIterator.empty();
  }

  keyIterator(): FluentIterator<E> {
    return FluentIterator.empty();
  }

  *keys(): IterableIterator<E> {}

  nbKeys(): number {
    return 0;
  }
}

export function emptyCollection<E>() {
  return EmptyCollection.instance<E>();
}
