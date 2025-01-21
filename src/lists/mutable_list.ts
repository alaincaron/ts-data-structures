import { Comparator, FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { List } from './list';
import { SequencedMutableCollection } from '../collections';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;

  remove(): E;
}

export class FluentListIterator<E> extends FluentIterator<E> {
  constructor(iterator: ListIterator<E>) {
    super(iterator);
  }

  [Symbol.iterator](): ListIterator<E> {
    return this.iter as ListIterator<E>;
  }

  setValue(value: E) {
    return (this.iter as ListIterator<E>).setValue(value);
  }

  remove() {
    return (this.iter as ListIterator<E>).remove();
  }
}

export interface MutableList<E> extends List<E>, SequencedMutableCollection<E> {
  offerAt(idx: number, item: E): boolean;

  addAt(idx: number, item: E): this;

  offerFirst(item: E): boolean;

  addFirst(item: E): this;

  offerLast(item: E): boolean;

  addLast(item: E): this;

  setAt(idx: number, item: E): E;

  removeAt(idx: number): E;

  removeRange(start: number, end?: number): this;

  removeFirst(): E;

  removeLast(): E;

  listIterator(skip?: number, count?: number): FluentListIterator<E>;

  transform(mapper: Mapper<E, E>): this;

  reverseListIterator(skip?: number, count?: number): FluentListIterator<E>;

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>): this;

  replaceAll(f: Mapper<E, E>): void;

  clear(): this;

  clone(): MutableList<E>;

  sort(): this;

  sort(arg1: number | Comparator<E> | undefined): this;

  sort(arg1: number, arg2: number | Comparator<E> | undefined): this;

  sort(arg1: number, arg2: number, arg3: Comparator<E> | undefined): this;

  sort(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): this;

  reverse(start?: number, end?: number): MutableList<E>;

  shuffle(): this;

  shuffle(arg1: number | Mapper<void, number> | undefined): this;

  shuffle(arg1: number, arg2: number | Mapper<void, number> | undefined): this;

  shuffle(arg1: number, arg2: number, arg3: Mapper<void, number> | undefined): this;

  shuffle(
    arg1?: number | Mapper<void, number>,
    arg2?: number | Mapper<void, number>,
    arg3?: Mapper<void, number> | undefined
  ): this;

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurrence(item: E): boolean;

  removeLastOccurrence(item: E): boolean;
}
