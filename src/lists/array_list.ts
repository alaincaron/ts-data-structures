import { AbstractList } from './abstract_list';
import { ListIterator } from './list';
import { CollectionInitializer, CollectionOptions } from '../collections';
import { UnderflowException, Predicate, IndexOutOfBoundsException } from '../utils';

export class ArrayList<E> extends AbstractList<E> {
  private elements: Array<E>;

  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
    this.elements = [];
  }

  static create<E>(initializer?: number | (CollectionOptions<E> & CollectionInitializer<E>)): ArrayList<E> {
    return AbstractList.buildCollection<E, ArrayList<E>, CollectionOptions<E>, CollectionInitializer<E>>(
      options => new ArrayList(options),
      initializer
    );
  }

  offerAt(idx: number, item: E): boolean {
    if (idx < 0 || idx > this.size()) throw new IndexOutOfBoundsException();
    if (!this.isFull()) {
      this.elements.splice(idx, 0, item);
      return true;
    }
    return false;
  }

  offer(item: E): boolean {
    return this.offerLast(item);
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

  sort() {
    this.elements.sort();
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

  *[Symbol.iterator](): IterableIterator<E> {
    let cursor = 0;
    while (cursor < this.size()) {
      yield this.elements[cursor++]!;
    }
  }

  iterator(): IterableIterator<E> {
    return this[Symbol.iterator]();
  }

  *reverseIterator(): IterableIterator<E> {
    let cursor = this.size() - 1;
    while (cursor >= 0) {
      yield this.elements[cursor--]!;
    }
  }

  filter(predicate: Predicate<E>): boolean {
    let cursor = 0;
    let modified = false;
    while (cursor < this.size()) {
      if (!predicate(this.elements[cursor]!)) {
        this.elements[cursor] = undefined!;
        modified = true;
      }
      ++cursor;
    }
    if (modified) this.compact();
    return modified;
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

  listIterator(start?: number): ListIterator<E> {
    let cursor = start ?? 0;
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
      previous: () => {
        if (cursor < 0) {
          return { done: true, value: undefined };
        }
        lastReturn = cursor--;
        return { done: false, value: this.getAt(lastReturn) };
      },
      setValue: (item: E) => this.setAt(lastReturn, item),
      remove: () => {
        const value = this.removeAt(lastReturn);
        if (cursor > lastReturn) cursor = lastReturn;
        lastReturn = -1;
        return value;
      },
    };
  }

  reverseListIterator(start?: number): ListIterator<E> {
    let cursor = start ?? this.size() - 1;
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
      previous: () => {
        if (cursor < 0) {
          return { done: true, value: undefined };
        }
        lastReturn = cursor++;
        return { done: false, value: this.getAt(lastReturn) };
      },
      setValue: (item: E) => this.setAt(lastReturn, item),
      remove: () => {
        const value = this.removeAt(lastReturn);
        if (cursor > lastReturn) cursor = lastReturn;
        return value;
      },
    };
  }
}
