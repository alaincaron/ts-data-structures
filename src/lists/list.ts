import { Comparator, FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import {
  equalsAny,
  equalsIterable,
  hashIterableOrdered,
  OverflowException,
  shuffle,
  UnderflowException,
} from '../utils';

export type ListPosition = number | 'head' | 'tail';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;
  remove(): E;
}

export abstract class List<E> extends Collection<E> {
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

  abstract listIterator(start?: ListPosition): ListIterator<E>;
  abstract reverseListIterator(start?: ListPosition): ListIterator<E>;

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>) {
    const iter = this.listIterator();
    for (;;) {
      const item = iter.next();
      if (item.done) break;
      const oldValue = item.value;
      if (predicate(oldValue)) iter.setValue(f(oldValue));
    }
  }

  replaceAll(f: (e: E) => E) {
    this.replaceIf(() => true, f);
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

  private static removeFirstItem<E>(iter: ListIterator<E>, predicate: Predicate<E>): E | undefined {
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
    return List.removeFirstItem(this.listIterator(), predicate);
  }

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined {
    return List.removeFirstItem(this.reverseListIterator(), predicate);
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

  abstract clone(): List<E>;

  hashCode() {
    return hashIterableOrdered(this);
  }

  equals(other: unknown) {
    if (this === other) return true;
    if (!(other instanceof List)) return false;
    if (other.size() !== this.size()) return false;
    return equalsIterable(this, other);
  }
}
