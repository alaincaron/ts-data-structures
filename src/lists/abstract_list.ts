import { Comparator, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { List, ListIterator } from './list';
import { AbstractCollection } from '../collections';
import { CapacityMixin, ContainerOptions, equalsAny, OverflowException, shuffle, UnderflowException } from '../utils';

export abstract class AbstractList<E = any> extends AbstractCollection<E> implements List<E> {
  constructor(options?: number | ContainerOptions) {
    super(options);
  }

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

  addAt(idx: number, item: E): void {
    if (!this.offerAt(idx, item)) throw new OverflowException();
  }

  offerFirst(item: E) {
    return this.offerAt(0, item);
  }

  addFirst(item: E) {
    if (!this.offerFirst(item)) throw new OverflowException();
  }

  offerLast(item: E) {
    return this.offerAt(this.size(), item);
  }

  addLast(item: E) {
    if (!this.offerLast(item)) throw new OverflowException();
  }

  abstract setAt(idx: number, item: E): E;

  abstract removeAt(idx: number): E;

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
      if (!predicate(item.value)) {
        iterator.remove();
        ++count;
      }
    }
    return count;
  }

  reverseIterator() {
    return new FluentIterator(this.reverseListIterator('tail'));
  }

  abstract listIterator(start?: number | 'head' | 'tail'): ListIterator<E>;
  abstract reverseListIterator(start?: number | 'head' | 'tail'): ListIterator<E>;

  replaceAll(f: (e: E) => E) {
    const iter = this.listIterator();
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      iter.setValue(f(item.value));
    }
  }

  indexOfFirstOccurence(predicate: Predicate<E>): number {
    let idx = -1;
    for (const e of this) {
      ++idx;
      if (predicate(e)) return idx;
    }
    return -1;
  }

  indexOf(e: E): number {
    return this.indexOfFirstOccurence(x => equalsAny(e, x));
  }

  indexOfLastOccurence(predicate: Predicate<E>): number {
    let idx = this.size();
    for (const e of this.reverseIterator()) {
      --idx;
      if (predicate(e)) return idx;
    }
    return -1;
  }

  lastIndexOf(e: E): number {
    return this.indexOfLastOccurence(x => equalsAny(e, x));
  }

  sort(comparator?: Comparator<E>) {
    if (this.size() <= 1) return;
    const arr = this.toArray().sort(comparator);
    const iter = this.listIterator();
    for (const e of arr) {
      iter.next();
      iter.setValue(e);
    }
  }

  reverse() {
    const n = this.size();
    if (n <= 1) return;
    let i = 0;
    let j = n - 1;
    const iter1 = this.listIterator();
    const iter2 = this.reverseListIterator();
    while (i < j) {
      const item1 = iter1.next();
      const item2 = iter2.next();
      iter1.setValue(item2.value);
      iter2.setValue(item1.value);
      ++i;
      --j;
    }
  }

  shuffle(random?: (n: number) => number) {
    if (this.size() <= 1) return;
    const arr = shuffle(this.toArray(), random);
    const iter = this.listIterator();
    for (const e of arr) {
      iter.next();
      iter.setValue(e);
    }
  }

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined {
    const iter = this.listIterator();
    for (;;) {
      const item = iter.next();
      if (item.done) return undefined;
      if (predicate(item.value)) {
        iter.remove();
        return item.value;
      }
    }
  }

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined {
    const iter = this.reverseListIterator();
    for (;;) {
      const item = iter.next();
      if (item.done) return undefined;
      if (predicate(item.value)) {
        iter.remove();
        return item.value;
      }
    }
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.removeFirstMatchingItem(predicate);
  }

  removeFirstOccurence(item: E) {
    return this.removeFirstMatchingItem(x => equalsAny(item, x)) != null;
  }

  removeLastOccurence(item: E) {
    return this.removeLastMatchingItem(x => equalsAny(item, x)) != null;
  }

  abstract clone(): AbstractList<E>;

  equals(other: unknown) {
    if (this === other) return true;
    if (!(other instanceof AbstractList)) return false;
    if (other.size() != this.size()) return false;
    const iter1 = this[Symbol.iterator]();
    const iter2 = other[Symbol.iterator]();
    for (;;) {
      const item1 = iter1.next();
      const item2 = iter2.next();
      if (item1.done || item2.done) return item1.done === item2.done;
      if (!equalsAny(item1.value, item2.value)) return false;
    }
  }
}

export const BoundedList = CapacityMixin(AbstractList);
