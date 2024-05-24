import { List, ListIterator, ListPosition } from './list';
import { buildCollection, CollectionInitializer } from '../collections';
import { DoubleLinkedList, IndexOutOfBoundsException, UnderflowException, WithCapacity } from '../utils';

interface ListEntry<E> {
  value: E;
}

type LinkedListEntry<E> = DoubleLinkedList.Entry & ListEntry<E>;

export class LinkedList<E> extends List<E> {
  private readonly linkedList: DoubleLinkedList;
  private _size: number;

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): LinkedList<E> {
    return buildCollection<E, LinkedList<E>>(LinkedList, initializer);
  }

  constructor() {
    super();
    this._size = 0;
    this.linkedList = new DoubleLinkedList();
  }

  size(): number {
    return this._size;
  }

  private getEntryAt(idx: number): LinkedListEntry<E> {
    const x = this.size() - idx;
    let e = this.linkedList.header;
    if (idx < x) {
      for (let i = 0; i <= idx; ++i) e = e.after!;
    } else {
      for (let i = 0; i < x; ++i) e = e.before!;
    }
    return e as LinkedListEntry<E>;
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
    const e = { value: item } as LinkedListEntry<E>;
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
    this.linkedList.remove(e as LinkedListEntry<E>);
    --this._size;
    return e.value;
  }

  offerLast(item: E): boolean {
    if (this.isFull()) return false;
    const e = { value: item } as LinkedListEntry<E>;
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

  private getListIterator(
    start: ListPosition,
    advance: (cursor: LinkedListEntry<E>) => LinkedListEntry<E>
  ): ListIterator<E> {
    let cursor: LinkedListEntry<E> = this.getEntryAt(
      typeof start === 'number' ? start : start === 'head' ? 0 : this.size() - 1
    );
    let lastResult: LinkedListEntry<E> | null = null;
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
        cursor = advance(cursor);
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

  listIterator(start?: ListPosition): ListIterator<E> {
    return this.getListIterator(start ?? 0, (cursor: LinkedListEntry<E>) => cursor.after as LinkedListEntry<E>);
  }

  reverseListIterator(start?: ListPosition): ListIterator<E> {
    return this.getListIterator(
      start ?? this.size() - 1,
      (cursor: LinkedListEntry<E>) => cursor.before as LinkedListEntry<E>
    );
  }

  clone(): LinkedList<E> {
    return LinkedList.create({ initial: this });
  }
}
