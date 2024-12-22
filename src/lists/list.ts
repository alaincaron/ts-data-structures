import { Comparator, FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyList } from './readonly_list';
import { Collection, SequencedCollection } from '../collections';

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

export interface List<E> extends Collection<E>, ReadOnlyList<E>, SequencedCollection<E> {
  offerAt(idx: number, item: E): boolean;

  addAt(idx: number, item: E): List<E>;

  offerFirst(item: E): boolean;

  addFirst(item: E): List<E>;

  offerLast(item: E): boolean;

  addLast(item: E): List<E>;

  setAt(idx: number, item: E): E;

  removeAt(idx: number): E;

  removeRange(start: number, end?: number): List<E>;

  removeFirst(): E;

  removeLast(): E;

  listIterator(skip?: number, count?: number): FluentListIterator<E>;

  transform(mapper: Mapper<E, E>): List<E>;

  reverseListIterator(skip?: number, count?: number): FluentListIterator<E>;

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>): List<E>;

  replaceAll(f: Mapper<E, E>): void;

  clear(): List<E>;

  clone(): List<E>;

  sort(): List<E>;

  sort(arg1: number | Comparator<E> | undefined): List<E>;

  sort(arg1: number, arg2: number | Comparator<E> | undefined): List<E>;

  sort(arg1: number, arg2: number, arg3: Comparator<E> | undefined): List<E>;

  sort(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): List<E>;

  reverse(start?: number, end?: number): List<E>;

  shuffle(): List<E>;

  shuffle(arg1: number | Mapper<void, number> | undefined): List<E>;

  shuffle(arg1: number, arg2: number | Mapper<void, number> | undefined): List<E>;

  shuffle(arg1: number, arg2: number, arg3: Mapper<void, number> | undefined): List<E>;

  shuffle(
    arg1?: number | Mapper<void, number>,
    arg2?: number | Mapper<void, number>,
    arg3?: Mapper<void, number> | undefined
  ): List<E>;

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurrence(item: E): boolean;

  removeLastOccurrence(item: E): boolean;
}
