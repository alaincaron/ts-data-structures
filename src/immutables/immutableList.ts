import { Comparator, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { EmptyList } from './emptyList';
import { ImmutableCollection } from './immutableCollection';
import { List } from '../lists';

export class ImmutableList<E> extends ImmutableCollection<E> implements List<E> {
  constructor(delegate: List<E>) {
    super(delegate);
  }

  static empty<E>(): List<E> {
    return EmptyList.instance();
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
