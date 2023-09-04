import { List, ListIterator } from './list';
import { Comparator, OverflowException, Predicate, RandomAccess, UnderflowException, shuffle } from '../utils';
import { AbstractCollection, CollectionOptions } from '../collections';

export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E>, RandomAccess<E> {
  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
  }

  abstract getAt(idx: number): E;

  getFirst() {
    return this.getAt(0);
  }

  getLast() {
    return this.getAt(this.size() - 1);
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

  filter(predicate: Predicate<E>): boolean {
    const iterator = this.listIterator();
    let modified = false;
    for (;;) {
      const item = iterator.next();
      if (item.done) break;
      if (!predicate(item.value)) {
        iterator.remove();
        modified = true;
      }
    }
    return modified;
  }

  abstract reverseIterator(): IterableIterator<E>;
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

  indexOf(e: E): number {
    const iter = this[Symbol.iterator]();
    let idx = 0;
    for (;;) {
      const item = iter.next();
      if (item.done) return -1;
      if (this.equals(item.value, e)) return idx;
      ++idx;
    }
  }

  lastIndexOf(e: E): number {
    const iter = this.reverseListIterator();
    let idx = this.size() - 1;
    for (;;) {
      const item = iter.next();
      if (item.done) return -1;
      if (this.equals(item.value, e)) return idx;
      --idx;
    }
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
    return this.removeFirstMatchingItem(x => this.equals(item, x)) != null;
  }

  removeLastOccurence(item: E) {
    return this.removeLastMatchingItem(x => this.equals(item, x)) != null;
  }

  abstract clone(): AbstractList<E>;
}
