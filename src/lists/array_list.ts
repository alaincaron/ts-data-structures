import { BoundedList } from './abstract_list';
import { ListIterator } from './list';
import { CollectionInitializer, buildCollection } from '../collections';
import { UnderflowException, IndexOutOfBoundsException, shuffle, ContainerOptions } from '../utils';
import { Predicate, Comparator } from 'ts-fluent-iterators';

export class ArrayList<E = any> extends BoundedList<E> {
  private elements: Array<E>;

  constructor(options?: number | ContainerOptions) {
    super(options);
    this.elements = [];
  }

  static create<E>(initializer?: number | (ContainerOptions & CollectionInitializer<E>)): ArrayList<E> {
    return buildCollection<E, ArrayList<E>>(ArrayList, initializer);
  }

  offerAt(idx: number, item: E): boolean {
    if (idx < 0 || idx > this.size()) throw new IndexOutOfBoundsException();
    if (!this.isFull()) {
      this.elements.splice(idx, 0, item);
      return true;
    }
    return false;
  }

  removeAt(idx: number): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
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
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    return this.elements[idx];
  }

  setAt(idx: number, item: E): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    const x = this.elements[idx];
    this.elements[idx] = item;
    return x;
  }

  sort(comparator?: Comparator<E>) {
    this.elements.sort(comparator);
  }

  shuffle(random?: (n: number) => number) {
    shuffle(this.elements, random);
  }

  size(): number {
    return this.elements.length;
  }

  clear() {
    this.elements = [];
  }

  clone(): ArrayList<E> {
    return ArrayList.create({ initial: this });
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

  listIterator(start?: number | 'head' | 'tail'): ListIterator<E> {
    let cursor = typeof start == 'number' ? start : start === 'tail' ? this.size() - 1 : 0;
    let lastReturn = -1;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (cursor >= this.size()) {
          return { done: true, value: undefined };
        }
        lastReturn = cursor++;
        return { done: false, value: this.getAt(lastReturn) };
      },
      setValue: (item: E) => this.setAt(lastReturn, item),
      remove: () => {
        const value = this.removeAt(lastReturn);
        cursor = lastReturn;
        lastReturn = -1;
        return value;
      },
    };
  }

  reverseListIterator(start?: number): ListIterator<E> {
    let cursor = typeof start == 'number' ? start : start === 'head' ? 0 : this.size() - 1;
    let lastReturn = -1;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (cursor <= 0) {
          return { done: true, value: undefined };
        }
        lastReturn = cursor--;
        return { done: false, value: this.getAt(lastReturn) };
      },
      setValue: (item: E) => this.setAt(lastReturn, item),
      remove: () => {
        const value = this.removeAt(lastReturn);
        lastReturn = -1;
        return value;
      },
    };
  }
}
