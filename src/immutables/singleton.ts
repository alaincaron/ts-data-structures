import { Comparator, Comparators, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyCollection } from '../collections';
import { ReadOnlyList } from '../lists';
import { ReadOnlyMultiSet } from '../multisets';
import { ReadOnlySet } from '../sets';
import {
  equalsAny,
  hashIterableOrdered,
  IndexOutOfBoundsException,
  iterableToJSON,
  Objects,
  parseArgs,
} from '../utils';

export class SingletonCollection<E> implements ReadOnlyList<E>, ReadOnlySet<E>, ReadOnlyMultiSet<E> {
  constructor(private readonly item: E) {}

  private checkBound(idx: number) {
    if (idx !== 0) throw new IndexOutOfBoundsException();
  }

  getAt(idx: number): E {
    this.checkBound(idx);
    return this.item;
  }

  getFirst(): E {
    return this.item;
  }

  getLast(): E {
    return this.item;
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  indexOfFirstOccurrence(predicate: Predicate<E>): number {
    return predicate(this.item) ? 0 : -1;
  }

  indexOf(item: E): number {
    return equalsAny(item, this.item) ? 0 : -1;
  }

  indexOfLastOccurrence(predicate: Predicate<E>): number {
    return predicate(this.item) ? 0 : -1;
  }

  lastIndexOf(item: E): number {
    return equalsAny(item, this.item) ? 0 : -1;
  }

  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    const { left, right } = parseArgs(0, arg1, arg2, arg3, Comparators.natural);
    this.checkBound(left);
    this.checkBound(right);
    return true;
  }

  isStrictlyOrdered(
    arg1?: number | Comparator<E> | undefined,
    arg2?: number | Comparator<E> | undefined,
    arg3?: Comparator<E> | undefined
  ): boolean;
  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    return this.isOrdered(arg1, arg2, arg3);
  }

  clone(): SingletonCollection<E> {
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

  equals(other: unknown): boolean {
    if (other === this) return true;
    if (!other) return false;
    if (!Objects.hasFunction(other, 'size')) return false;
    if (!Objects.hasFunction(other, 'contains')) return false;
    const tmp = other as ReadOnlyCollection<E>;
    return tmp.size() === 1 && tmp.contains(this.item);
  }

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
    return true;
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

  toSet() {
    return new Set<E>().add(this.item);
  }

  count(item: E) {
    return equalsAny(item, this.item) ? 1 : 0;
  }

  *entries(): IterableIterator<[E, number]> {
    yield [this.item, 1];
  }
}
