import { Comparator, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyCollection } from '../collections';
import { ReadOnlyList } from '../lists';
import { ReadOnlySet } from '../sets';

export class ImmutableCollection<E> implements ReadOnlyCollection<E> {
  constructor(protected readonly _delegate: ReadOnlyCollection<E>) {}

  protected get delegate(): ReadOnlyCollection<E> {
    return this._delegate;
  }

  clone(): ReadOnlyCollection<E> {
    return this;
  }

  contains(item: E): boolean {
    return this._delegate.contains(item);
  }

  includes(item: E): boolean {
    return this._delegate.includes(item);
  }

  toArray(): E[] {
    return this._delegate.toArray();
  }

  find(predicate: Predicate<E>): E | undefined {
    return this._delegate.find(predicate);
  }

  containsAll<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean {
    return this._delegate.containsAll(iteratorLike);
  }

  disjoint<E1 extends E>(iteratorLike: IteratorLike<E1>): boolean {
    return this._delegate.containsAll(iteratorLike);
  }

  iterator(): FluentIterator<E> {
    return this._delegate.iterator();
  }

  hashCode(): number {
    return this._delegate.hashCode();
  }

  equals(other: unknown): boolean {
    return this._delegate.equals(other);
  }

  size(): number {
    return this._delegate.size();
  }

  capacity(): number {
    return this._delegate.size();
  }

  isEmpty(): boolean {
    return this._delegate.isEmpty();
  }

  isFull(): boolean {
    return true;
  }

  remaining(): number {
    return 0;
  }

  toJSON(): string {
    return this._delegate.toJSON();
  }

  [Symbol.iterator]() {
    return this._delegate[Symbol.iterator]();
  }
}

export class ImmutableList<E> extends ImmutableCollection<E> implements ReadOnlyList<E> {
  constructor(delegate: ReadOnlyList<E>) {
    super(delegate);
  }

  protected get delegate(): ReadOnlyList<E> {
    return super.delegate as ReadOnlyList<E>;
  }

  getAt(idx: number) {
    return this.delegate.getAt(idx);
  }

  getFirst() {
    return this.delegate.getFirst();
  }

  getLast() {
    return this.delegate.getLast();
  }

  reverseIterator() {
    return this.delegate.reverseIterator();
  }

  indexOfFirstOccurrence(predicate: Predicate<E>) {
    return this.delegate.indexOfFirstOccurrence(predicate);
  }

  indexOf(e: E): number {
    return this.delegate.indexOf(e);
  }

  indexOfLastOccurrence(predicate: Predicate<E>): number {
    return this.delegate.indexOfLastOccurrence(predicate);
  }

  lastIndexOf(e: E): number {
    return this.delegate.lastIndexOf(e);
  }

  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean {
    return this.delegate.isOrdered(arg1, arg2, arg3);
  }

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean {
    return this.delegate.isStrictlyOrdered(arg1, arg2, arg3);
  }

  clone(): ReadOnlyList<E> {
    return this;
  }
}

export class ImmutableSet<E> extends ImmutableCollection<E> implements ReadOnlySet<E> {
  constructor(delegate: ReadOnlySet<E>) {
    super(delegate);
  }

  protected get delegate(): ReadOnlySet<E> {
    return super.delegate as ReadOnlySet<E>;
  }

  clone(): ReadOnlySet<E> {
    return this;
  }

  toSet(): Set<E> {
    return this.delegate.toSet();
  }
}
