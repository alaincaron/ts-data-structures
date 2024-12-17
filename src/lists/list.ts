import { Comparator, FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;

  remove(): E;
}

export interface List<E> extends Collection<E> {
  getAt(idx: number): E;

  getFirst(): E;

  getLast(): E;

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

  reverseIterator(): FluentIterator<unknown>;

  listIterator(skip?: number, count?: number): ListIterator<E>;

  transform(mapper: Mapper<E, E>): List<E>;

  reverseListIterator(skip?: number, count?: number): ListIterator<E>;

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>): List<E>;

  replaceAll(f: Mapper<E, E>): void;

  indexOfFirstOccurrence(predicate: Predicate<E>): number;

  clear(): List<E>;

  clone(): List<E>;

  indexOf(e: E): number;

  indexOfLastOccurrence(predicate: Predicate<E>): number;

  lastIndexOf(e: E): number;

  sort(): List<E>;

  sort(arg1: number | Comparator<E> | undefined): List<E>;

  sort(arg1: number, arg2: number | Comparator<E> | undefined): List<E>;

  sort(arg1: number, arg2: number, arg3: Comparator<E> | undefined): List<E>;

  sort(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): List<E>;

  isOrdered(): boolean;

  isOrdered(arg1: number | Comparator<E> | undefined): boolean;

  isOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;

  isOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;

  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean;

  isStrictlyOrdered(): boolean;

  isStrictlyOrdered(arg1: number | Comparator<E> | undefined): boolean;

  isStrictlyOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;

  isStrictlyOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>): boolean;

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
