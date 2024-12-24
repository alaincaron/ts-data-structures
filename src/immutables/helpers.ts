import { Collector, Comparator, FluentIterator, IteratorLike, Predicate } from 'ts-fluent-iterators';
import { Collection, MutableCollection } from '../collections';
import { List } from '../lists';
import { MultiSet } from '../multisets';
import { ISet } from '../sets';

export class ImmutableCollection<E> implements Collection<E> {
  constructor(protected readonly _delegate: Collection<E>) {}

  protected get delegate() {
    return this._delegate;
  }

  clone() {
    return this;
  }

  contains(item: E) {
    return this._delegate.contains(item);
  }

  includes(item: E) {
    return this._delegate.includes(item);
  }

  toArray() {
    return this._delegate.toArray();
  }

  toCollector<R>(c: Collector<E, R>) {
    return this._delegate.toCollector(c);
  }

  toCollection<C extends MutableCollection<E>>(c: C) {
    c.addFully(this);
    return c;
  }

  find(predicate: Predicate<E>) {
    return this._delegate.find(predicate);
  }

  containsAll<E1 extends E>(iteratorLike: IteratorLike<E1>) {
    return this._delegate.containsAll(iteratorLike);
  }

  disjoint<E1 extends E>(iteratorLike: IteratorLike<E1>) {
    return this._delegate.containsAll(iteratorLike);
  }

  iterator() {
    return this._delegate.iterator();
  }

  hashCode() {
    return this._delegate.hashCode();
  }

  equals(other: unknown) {
    return this._delegate.equals(other);
  }

  size() {
    return this._delegate.size();
  }

  capacity() {
    return this._delegate.size();
  }

  isEmpty() {
    return this._delegate.isEmpty();
  }

  isFull() {
    return true;
  }

  remaining() {
    return 0;
  }

  toJSON() {
    return this._delegate.toJSON();
  }

  [Symbol.iterator]() {
    return this._delegate[Symbol.iterator]();
  }

  asReadOnly() {
    return this;
  }

  toReadOnly() {
    return this;
  }
}

export class ImmutableList<E> extends ImmutableCollection<E> implements List<E> {
  constructor(delegate: List<E>) {
    super(delegate);
  }

  protected get delegate() {
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

  listIterator(skip?: number, count?: number) {
    const iterator = this.delegate.listIterator(skip, count);
    return new FluentIterator(iterator[Symbol.iterator]());
  }

  reverseListIterator(skip?: number, count?: number) {
    const iterator = this.delegate.reverseListIterator(skip, count);
    return new FluentIterator(iterator[Symbol.iterator]());
  }

  indexOf(e: E) {
    return this.delegate.indexOf(e);
  }

  indexOfLastOccurrence(predicate: Predicate<E>) {
    return this.delegate.indexOfLastOccurrence(predicate);
  }

  lastIndexOf(e: E) {
    return this.delegate.lastIndexOf(e);
  }

  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    return this.delegate.isOrdered(arg1, arg2, arg3);
  }

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    return this.delegate.isStrictlyOrdered(arg1, arg2, arg3);
  }

  peekFirst() {
    return this.delegate.peekFirst();
  }

  peekLast() {
    return this.delegate.peekLast();
  }

  clone() {
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

  clone() {
    return this;
  }

  toSet(): Set<E> {
    return this.delegate.toSet();
  }
}

export class ImmutableMultiSet<E> extends ImmutableCollection<E> implements MultiSet<E> {
  constructor(delegate: MultiSet<E>) {
    super(delegate);
  }

  protected get delegate() {
    return super.delegate as MultiSet<E>;
  }

  count(item: E) {
    return this.delegate.count(item);
  }

  entries() {
    return this.delegate.entries();
  }

  clone() {
    return this;
  }
}
