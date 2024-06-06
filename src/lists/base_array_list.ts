import { Comparator, Comparators, Predicate } from 'ts-fluent-iterators';
import { List } from './list';
import { shuffle, UnderflowException } from '../utils';

export abstract class BaseArrayList<E> extends List<E> {
  constructor(protected readonly elements: Array<E>) {
    super();
  }

  offerAt(idx: number, item: E): boolean {
    if (this.isFull()) return false;
    this.checkBoundForAdd(idx);
    this.elements.splice(idx, 0, item);
    return true;
  }

  removeAt(idx: number): E {
    this.checkBound(idx);
    return this.elements.splice(idx, 1)[0];
  }

  offerLast(item: E): boolean {
    if (!this.isFull()) {
      this.elements.push(item);
      return true;
    }
    return false;
  }

  removeFirst(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.elements.shift()!;
  }

  removeLast(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.elements.pop()!;
  }

  getAt(idx: number): E {
    this.checkBound(idx);
    return this.elements[idx];
  }

  setAt(idx: number, item: E): E {
    this.checkBound(idx);
    const x = this.elements[idx];
    this.elements[idx] = item;
    return x;
  }

  sort(comparator: Comparator<E> = Comparators.natural) {
    this.elements.sort(comparator);
  }

  shuffle(random?: () => number) {
    shuffle(this.elements, random);
  }

  size(): number {
    return this.elements.length;
  }

  removeRange(fromIdx: number, toIdx?: number) {
    toIdx = this.checkRemoveRangeBounds(fromIdx, toIdx);
    this.elements.splice(fromIdx, toIdx - fromIdx);
  }

  clear() {
    this.elements.length = 0;
  }

  *[Symbol.iterator]() {
    let cursor = 0;
    while (cursor < this.size()) {
      yield this.elements[cursor++]!;
    }
  }

  filter(predicate: Predicate<E>): number {
    let cursor = 0;
    let count = 0;
    while (cursor < this.size()) {
      if (!predicate(this.elements[cursor]!)) {
        this.elements[cursor] = undefined!;
        ++count;
      }
      ++cursor;
    }
    if (count) this.compact();
    return count;
  }

  private compact(cursor?: number): number {
    let shift = 0;
    cursor ??= 0;
    while (cursor < this.size()) {
      if (this.elements[cursor] == null) {
        ++shift;
      } else if (shift > 0) {
        this.elements[cursor - shift] = this.elements[cursor];
        this.elements[cursor] = undefined!;
      }
      ++cursor;
    }
    this.elements.length -= shift;
    return shift;
  }
}
