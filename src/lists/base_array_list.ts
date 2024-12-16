import { Comparator, Comparators, Mapper, Predicate } from 'ts-fluent-iterators';
import { List } from './list';
import { bsearch, insertSorted, parseArgs, qsort, SearchOptions, shuffle, UnderflowException } from '../utils';

export abstract class BaseArrayList<E> extends List<E> {
  protected constructor(protected readonly elements: Array<E>) {
    super();
  }

  toArray(start?: number, end?: number): E[] {
    start ??= 0;
    end ??= this.size();
    return this.elements.slice(start, end);
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

  sort(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): List<E> {
    const { left, right, f: comparator } = parseArgs(this.size(), arg1, arg2, arg3, Comparators.natural);
    this.checkBounds(left, right);
    qsort(this.elements, left, right, comparator);
    return this;
  }

  bsearch<K = E>(e: K, options?: SearchOptions<E, K>): number {
    return bsearch(this.elements, e, options);
  }

  insertSorted(e: E, comparator: Comparator<E> = Comparators.natural): BaseArrayList<E> {
    insertSorted(this.elements, e, comparator);
    return this;
  }

  shuffle(
    arg1?: number | Mapper<void, number>,
    arg2?: number | Mapper<void, number>,
    arg3?: Mapper<void, number> | undefined
  ): List<E> {
    const { left, right, f: mapper } = parseArgs(this.size(), arg1, arg2, arg3, Math.random);
    this.checkBounds(left, right);
    shuffle(this.elements, left, right, mapper);
    return this;
  }

  size(): number {
    return this.elements.length;
  }

  removeRange(start: number, end?: number) {
    end ??= this.size();
    this.checkBounds(start, end);
    this.elements.splice(start, end - start);
    return this;
  }

  clear() {
    this.elements.length = 0;
    return this;
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
