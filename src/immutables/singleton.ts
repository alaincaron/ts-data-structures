import { Collector, Comparator, Comparators, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection, MutableCollection } from '../collections';
import { List } from '../lists';
import {
  checkListBound,
  checkListBounds,
  computeListIteratorBounds,
  computeListReverseIteratorBounds,
} from '../lists/helpers';
import { MultiSetEntry, SortedMultiSet } from '../multisets';
import { SortedSet } from '../sets';
import { equalsAny, hashIterableOrdered, iterableToJSON, Objects, parseArgs } from '../utils';

export class SingletonCollection<E> implements List<E>, SortedSet<E>, SortedMultiSet<E> {
  constructor(private readonly item: E) {}

  getAt(idx: number): E {
    checkListBound(this, idx);
    return this.item;
  }

  getFirst(): E {
    return this.item;
  }

  peekFirst() {
    return this.item;
  }

  getLast(): E {
    return this.item;
  }

  peekLast() {
    return this.item;
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  listIterator(skip?: number, count?: number): FluentIterator<E> {
    const bounds = computeListIteratorBounds(this, skip, count);
    return bounds.count ? FluentIterator.singleton(this.item) : FluentIterator.empty();
  }

  reverseListIterator(skip?: number, count?: number): FluentIterator<E> {
    const bounds = computeListReverseIteratorBounds(this, skip, count);
    return bounds.count ? FluentIterator.singleton(this.item) : FluentIterator.empty();
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
    checkListBounds(this, left, right);
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

  toArray(start?: number, end?: number): E[] {
    start ??= 0;
    end ??= 1;
    checkListBounds(this, start, end);
    return [this.item];
  }

  toCollector<R>(c: Collector<E, R>): R {
    c.collect(this.item);
    return c.result;
  }

  toCollection<C extends MutableCollection<E>>(c: C): C {
    c.add(this.item);
    return c;
  }

  toReadOnly(): SingletonCollection<E> {
    return this;
  }

  asReadOnly(): SingletonCollection<E> {
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

  equals(other: unknown): boolean {
    if (other === this) return true;
    if (!other) return false;
    if (!Objects.hasFunction(other, 'size')) return false;
    if (!Objects.hasFunction(other, 'contains')) return false;
    const tmp = other as Collection<E>;
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

  *entries(): IterableIterator<MultiSetEntry<E>> {
    yield this.firstEntry();
  }

  entryIterator(): FluentIterator<MultiSetEntry<E>> {
    return new FluentIterator(this.entries());
  }

  keyIterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  *keys() {
    yield this.item;
  }

  nbKeys(): number {
    return 1;
  }

  first() {
    return this.item;
  }

  last() {
    return this.item;
  }

  firstEntry(): MultiSetEntry<E> {
    return { key: this.item, count: 1 };
  }

  lastEntry(): MultiSetEntry<E> {
    return this.firstEntry();
  }

  reverseEntryIterator(): FluentIterator<MultiSetEntry<E>> {
    return this.entryIterator();
  }
}
