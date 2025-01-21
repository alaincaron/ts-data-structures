import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { SingletonCollection } from './singletonCollection';
import { List } from '../lists';
import {
  checkListBound,
  checkListBounds,
  computeListIteratorBounds,
  computeListReverseIteratorBounds,
  isList,
} from '../lists/helpers';
import { equalsAny, parseArgs } from '../utils';

export class SingletonList<E> extends SingletonCollection<E> implements List<E> {
  constructor(item: E) {
    super(item);
  }

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

  toArray(start?: number, end?: number): E[] {
    start ??= 0;
    end ??= 1;
    checkListBounds(this, start, end);
    return [this.item];
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return isList(other) && other.size() === 1 && other.contains(this.item);
  }

  first() {
    return this.item;
  }

  last() {
    return this.item;
  }
}
