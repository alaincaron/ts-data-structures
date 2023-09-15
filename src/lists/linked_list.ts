import { AbstractList } from './abstract_list';
import { ListIterator } from './list';
import { DoubleLinkedList, IndexOutOfBoundsException, UnderflowException } from '../utils';
import { CollectionOptions, CollectionInitializer } from '../collections';

interface ListEntry<E> {
  value: E;
}

export class LinkedList<E> extends AbstractList<E> {
  private readonly linkedList: DoubleLinkedList;
  private _size: number;

  static create<E>(initializer?: number | (CollectionOptions & CollectionInitializer<E>)): LinkedList<E> {
    return AbstractList.buildCollection<E, LinkedList<E>, CollectionOptions, CollectionInitializer<E>>(
      options => new LinkedList(options),
      initializer
    );
  }

  constructor(options?: number | CollectionOptions) {
    super(options);
    this._size = 0;
    this.linkedList = new DoubleLinkedList();
  }

  size(): number {
    return this._size;
  }

  private getEntryAt(idx: number): DoubleLinkedList.Entry & ListEntry<E> {
    const x = this.size() - idx;
    let e = this.linkedList.header;
    if (idx < x) {
      for (let i = 0; i <= idx; ++i) e = e.after!;
    } else {
      for (let i = 0; i < x; ++i) e = e.before!;
    }
    return e as unknown as ListEntry<E> & DoubleLinkedList.Entry;
  }

  getAt(idx: number): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    const e = this.getEntryAt(idx);
    return e.value;
  }

  getFirst() {
    if (this.isEmpty()) throw new UnderflowException();
    return (this.linkedList.header.after as unknown as ListEntry<E>).value;
  }

  getLast() {
    if (this.isEmpty()) throw new UnderflowException();
    return (this.linkedList.header.before as unknown as ListEntry<E>).value;
  }

  offerAt(idx: number, item: E): boolean {
    if (this.isFull()) return false;
    if (idx < 0 || idx > this.size()) throw new IndexOutOfBoundsException();
    const e = { value: item } as unknown as DoubleLinkedList.Entry;
    const existing = this.getEntryAt(idx);
    this.linkedList.addBefore(e, existing);
    ++this._size;
    return true;
  }

  setAt(idx: number, item: E): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    const e = this.getEntryAt(idx);
    const old = e.value;
    e.value = item;
    return old;
  }

  removeAt(idx: number): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    const e = this.getEntryAt(idx);
    this.linkedList.remove(e as unknown as DoubleLinkedList.Entry);
    --this._size;
    return e.value;
  }

  offerLast(item: E): boolean {
    if (this.isFull()) return false;
    const e = { value: item } as unknown as DoubleLinkedList.Entry;
    this.linkedList.addLast(e);
    ++this._size;
    return true;
  }

  clear(): void {
    this._size = 0;
    this.linkedList.clear();
  }

  *[Symbol.iterator]() {
    for (const e of this.linkedList.entries()) {
      yield (e as unknown as ListEntry<E>).value;
    }
  }

  listIterator(start?: number | 'head' | 'tail'): ListIterator<E> {
    if (typeof start !== 'number') {
      start = start === 'tail' ? this.size() - 1 : 0;
    }
    let cursor = this.getEntryAt(start);
    let lastResult: (DoubleLinkedList.Entry & ListEntry<E>) | null = null;

    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (cursor === this.linkedList.header) {
          return { done: true, value: undefined };
        }
        const value = cursor.value;
        lastResult = cursor;
        cursor = cursor.after as unknown as DoubleLinkedList.Entry & ListEntry<E>;
        return { done: false, value };
      },
      remove: () => {
        if (lastResult === null) throw new Error('Invoking remove twice');
        this.linkedList.remove(lastResult);
        const value = lastResult.value;
        lastResult = null;
        --this._size;
        return value;
      },
      setValue: (newValue: E) => {
        if (lastResult === null) throw new Error('Invoking setValue after remove');
        const value = lastResult.value;
        lastResult.value = newValue;
        return value;
      },
    };
  }

  reverseListIterator(start?: number | 'head' | 'tail'): ListIterator<E> {
    if (typeof start !== 'number') {
      start = start === 'head' ? 0 : this.size() - 1;
    }
    let cursor = this.getEntryAt(start);
    let lastResult: (DoubleLinkedList.Entry & ListEntry<E>) | null = null;

    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (cursor === this.linkedList.header) {
          return { done: true, value: undefined };
        }
        const value = cursor.value;
        lastResult = cursor;
        cursor = cursor.before as unknown as DoubleLinkedList.Entry & ListEntry<E>;
        return { done: false, value };
      },
      remove: () => {
        if (lastResult === null) throw new Error('Invoking remove twice');
        this.linkedList.remove(lastResult);
        const value = lastResult.value;
        lastResult = null;
        --this._size;
        return value;
      },
      setValue: (newValue: E) => {
        if (lastResult === null) throw new Error('Invoking setValue after remove');
        const value = lastResult.value;
        lastResult.value = newValue;
        return value;
      },
    };
  }

  clone(): LinkedList<E> {
    return LinkedList.create({ initial: this });
  }
}
