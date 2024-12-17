import { Comparator, Comparators, FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { List, ListIterator } from './list';
import { AbstractCollection } from '../collections';
import { objectHasFunction } from '../collections/helpers';
import {
  equalsAny,
  equalsIterable,
  hashIterableOrdered,
  IllegalArgumentException,
  IndexOutOfBoundsException,
  OverflowException,
  parseArgs,
  qsort,
  shuffle,
  UnderflowException,
} from '../utils';

export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
  abstract getAt(idx: number): E;

  getFirst() {
    if (this.isEmpty()) throw new UnderflowException();
    return this.getAt(0);
  }

  getLast() {
    if (this.isEmpty()) throw new UnderflowException();
    return this.getAt(this.size() - 1);
  }

  offer(item: E): boolean {
    return this.offerLast(item);
  }

  abstract offerAt(idx: number, item: E): boolean;

  protected checkBounds(start: number, end: number) {
    this.checkBoundForAdd(start);
    this.checkBoundForAdd(end);
    if (start > end) {
      throw new IllegalArgumentException(`Argument start ${start} must be at least as argument end ${end}`);
    }
  }

  protected checkBound(idx: number) {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
  }

  protected checkBoundForAdd(idx: number) {
    if (idx < 0 || idx > this.size()) throw new IndexOutOfBoundsException();
  }

  addAt(idx: number, item: E): AbstractList<E> {
    if (!this.offerAt(idx, item)) throw new OverflowException();
    return this;
  }

  offerFirst(item: E) {
    return this.offerAt(0, item);
  }

  addFirst(item: E): AbstractList<E> {
    if (!this.offerFirst(item)) throw new OverflowException();
    return this;
  }

  offerLast(item: E) {
    return this.offerAt(this.size(), item);
  }

  addLast(item: E): AbstractList<E> {
    if (!this.offerLast(item)) throw new OverflowException();
    return this;
  }

  abstract setAt(idx: number, item: E): E;

  abstract removeAt(idx: number): E;

  removeRange(start: number, end?: number): AbstractList<E> {
    end ??= this.size();
    this.checkBounds(start, end);
    const iter = this.listIterator(start);
    for (let i = start; i < end; ++i) {
      const item = iter.next();
      if (item.done) break;
      iter.remove();
    }
    return this;
  }

  clear() {
    return this.removeRange(0, this.size());
  }

  removeFirst(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.removeAt(0);
  }

  removeLast(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.removeAt(this.size() - 1);
  }

  filter(predicate: Predicate<E>) {
    const iterator = this.listIterator();
    let count = 0;
    for (;;) {
      const item = iterator.next();
      if (item.done) break;
      if (predicate(item.value)) continue;
      iterator.remove();
      ++count;
    }
    return count;
  }

  reverseIterator() {
    return new FluentIterator(this.reverseListIterator());
  }

  private getListIterator(start: number, count: number, advance: (cursor: number) => number): ListIterator<E> {
    let lastReturn = -1;
    let cursor = start;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (count <= 0 || cursor < 0 || cursor >= this.size()) {
          return { done: true, value: undefined };
        }
        --count;
        lastReturn = cursor;
        cursor = advance(cursor);
        return { done: false, value: this.getAt(lastReturn) };
      },
      setValue: (item: E) => {
        if (lastReturn === -1) throw new Error("Error invoking setValue: can't be invoked after remove");
        return this.setAt(lastReturn, item);
      },
      remove: () => {
        if (lastReturn === -1) throw new Error('Error invoking remove: Can only be done once per iteration');
        const value = this.removeAt(lastReturn);
        cursor = lastReturn;
        lastReturn = -1;
        return value;
      },
    };
  }

  protected computeIteratorBounds(skip?: number, count?: number) {
    skip ??= 0;
    this.checkBoundForAdd(skip);
    count ??= this.size() - skip;
    if (count < 0 || count + skip > this.size())
      throw new IndexOutOfBoundsException(`Invalid skip = ${skip}, count = ${count}, size = ${this.size}`);
    return { start: skip, count };
  }

  listIterator(skip?: number, count?: number): ListIterator<E> {
    const bounds = this.computeIteratorBounds(skip, count);
    return this.getListIterator(bounds.start, bounds.count, cursor => cursor + 1);
  }

  transform(mapper: Mapper<E, E>): AbstractList<E> {
    return this.replaceIf(_ => true, mapper);
  }

  protected computeReverseIteratorBounds(skip?: number, count?: number) {
    skip ??= 0;
    this.checkBoundForAdd(skip);
    const start = this.size() - 1 - skip;
    count ??= start + 1;
    if (count < 0 || count > start + 1)
      throw new IndexOutOfBoundsException(
        `Reverse iterator invalid skip = ${skip}, count = ${count}, size= ${this.size()}`
      );
    return { start, count };
  }

  reverseListIterator(skip?: number, count?: number): ListIterator<E> {
    const bounds = this.computeReverseIteratorBounds(skip, count);
    return this.getListIterator(bounds.start, bounds.count, cursor => cursor - 1);
  }

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>): AbstractList<E> {
    const iter = this.listIterator();
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      const oldValue = item.value;
      if (predicate(oldValue)) iter.setValue(f(oldValue));
    }
    return this;
  }

  replaceAll(f: Mapper<E, E>) {
    this.replaceIf(_ => true, f);
  }

  indexOfFirstOccurrence(predicate: Predicate<E>): number {
    let idx = -1;
    for (const e of this) {
      ++idx;
      if (predicate(e)) return idx;
    }
    return -1;
  }

  indexOf(e: E): number {
    return this.indexOfFirstOccurrence(x => equalsAny(e, x));
  }

  indexOfLastOccurrence(predicate: Predicate<E>): number {
    let idx = this.size();
    for (const e of this.reverseIterator()) {
      --idx;
      if (predicate(e)) return idx;
    }
    return -1;
  }

  lastIndexOf(e: E): number {
    return this.indexOfLastOccurrence(x => equalsAny(e, x));
  }

  sort(): AbstractList<E>;
  sort(arg1: number | Comparator<E> | undefined): AbstractList<E>;
  sort(arg1: number, arg2: number | Comparator<E> | undefined): AbstractList<E>;
  sort(arg1: number, arg2: number, arg3: Comparator<E> | undefined): AbstractList<E>;

  sort(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): AbstractList<E> {
    const { left, right, f: comparator } = parseArgs(this.size(), arg1, arg2, arg3, Comparators.natural);
    this.checkBounds(left, right);
    if (left >= right) return this;
    const arr = qsort(this.toArray(left, right), comparator);
    const iter = this.listIterator(left, right - left);
    for (const e of arr) {
      iter.next();
      iter.setValue(e);
    }
    return this;
  }

  isOrdered(): boolean;
  isOrdered(arg1: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;

  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean {
    const { left, right, f: comparator } = parseArgs(this.size(), arg1, arg2, arg3, Comparators.natural);
    this.checkBounds(left, right);
    return Comparators.isOrdered(comparator, this.listIterator(left, right - left));
  }

  isStrictlyOrdered(): boolean;
  isStrictlyOrdered(arg1: number | Comparator<E> | undefined): boolean;
  isStrictlyOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;
  isStrictlyOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean {
    const { left, right, f: comparator } = parseArgs(this.size(), arg1, arg2, arg3, Comparators.natural);
    this.checkBounds(left, right);

    return Comparators.isStrictlyOrdered(comparator, this.listIterator(left, right - left));
  }

  reverse(start?: number, end?: number): AbstractList<E> {
    start ??= 0;
    end ??= this.size();
    this.checkBounds(start, end);
    if (end - start <= 1) return this;
    const iter1 = this.listIterator(start);
    const iter2 = this.reverseListIterator(this.size() - end);
    let i = 0;
    let j = end - 1;
    while (i < j) {
      const item1 = iter1.next();
      const item2 = iter2.next();
      iter1.setValue(item2.value);
      iter2.setValue(item1.value);
      ++i;
      --j;
    }
    return this;
  }

  shuffle(): AbstractList<E>;
  shuffle(arg1: number | Mapper<void, number> | undefined): AbstractList<E>;
  shuffle(arg1: number, arg2: number | Mapper<void, number> | undefined): AbstractList<E>;
  shuffle(arg1: number, arg2: number, arg3: Mapper<void, number> | undefined): AbstractList<E>;
  shuffle(
    arg1?: number | Mapper<void, number>,
    arg2?: number | Mapper<void, number>,
    arg3?: Mapper<void, number> | undefined
  ): AbstractList<E> {
    const { left, right, f: random } = parseArgs(this.size(), arg1, arg2, arg3, Math.random);
    this.checkBounds(left, right);
    if (left >= right) return this;
    const arr = shuffle(this.toArray(left, right), random);
    const iter = this.listIterator(left);
    for (const e of arr) {
      iter.next();
      iter.setValue(e);
    }
    return this;
  }

  toArray(start?: number, end?: number): E[] {
    start ??= 0;
    end ??= this.size();
    this.checkBounds(start, end);
    return new FluentIterator(this.listIterator(start, end - start)).collect();
  }

  private removeFirstItem<E>(iter: ListIterator<E>, predicate: Predicate<E>): E | undefined {
    for (;;) {
      const item = iter.next();
      if (item.done) return undefined;
      if (predicate(item.value)) {
        iter.remove();
        return item.value;
      }
    }
  }

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.removeFirstItem(this.listIterator(), predicate);
  }

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.removeFirstItem(this.reverseListIterator(), predicate);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.removeFirstMatchingItem(predicate);
  }

  removeFirstOccurrence(item: E) {
    return this.removeFirstMatchingItem(x => equalsAny(item, x)) != null;
  }

  removeLastOccurrence(item: E) {
    return this.removeLastMatchingItem(x => equalsAny(item, x)) != null;
  }

  abstract clone(): AbstractList<E>;

  hashCode() {
    return hashIterableOrdered(this);
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!isList(other)) return false;
    if (other.size() !== this.size()) return false;
    return equalsIterable(this.listIterator(), other.listIterator());
  }
}

function isList(obj: unknown): obj is List<unknown> {
  if (!obj || typeof obj !== 'object') return false;
  if (!objectHasFunction(obj, 'size')) return false;
  if (!objectHasFunction(obj, 'listIterator')) return false;
  return true;
}
