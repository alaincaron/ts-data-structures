import { Comparator, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { List } from '../lists';
import { ISet } from '../sets';

export class ImmutableCollection<E> implements Collection<E> {
  constructor(protected readonly _delegate: Collection<E>) {}

  protected get delegate(): Collection<E> {
    return this._delegate;
  }

  clone(): Collection<E> {
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

export class ImmutableList<E> extends ImmutableCollection<E> implements List<E> {
  constructor(delegate: List<E>) {
    super(delegate);
  }

  protected get delegate(): List<E> {
    return super.delegate as List<E>;
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

  listIterator(skip?: number, count?: number): FluentIterator<E> {
    const iterator = this.delegate.listIterator(skip, count);
    return new FluentIterator(iterator[Symbol.iterator]());
  }

  reverseListIterator(skip?: number, count?: number): FluentIterator<E> {
    const iterator = this.delegate.reverseListIterator(skip, count);
    return new FluentIterator(iterator[Symbol.iterator]());
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

  peekFirst() {
    return this.delegate.peekFirst();
  }

  peekLast() {
    return this.delegate.peekLast();
  }

  clone(): List<E> {
    return this;
  }
}

export class ImmutableSet<E> extends ImmutableCollection<E> implements ISet<E> {
  constructor(delegate: ISet<E>) {
    super(delegate);
  }

  protected get delegate(): ISet<E> {
    return super.delegate as ISet<E>;
  }

  clone(): ISet<E> {
    return this;
  }

  toSet(): Set<E> {
    return this.delegate.toSet();
  }
}
