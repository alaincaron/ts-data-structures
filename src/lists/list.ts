import { Collection } from '../collections';
import { RandomAccess } from '../utils';
import { Comparator, FluentIterator, Predicate } from 'ts-fluent-iterators';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;
  remove(): E;
}

export interface List<E = any> extends Collection<E>, RandomAccess<E> {
  getAt(idx: number): E;
  getFirst(): E;
  getLast(): E;

  offerAt(idx: number, item: E): boolean;
  addAt(idx: number, item: E): void;

  offerFirst(item: E): boolean;
  addFirst(item: E): void;

  offerLast(item: E): boolean;
  addLast(item: E): void;

  removeAt(idx: number): E;
  removeFirst(): E;
  removeLast(): E;

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;
  removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurence(item: E): boolean;
  removeLastOccurence(item: E): boolean;

  reverseIterator(): FluentIterator<E>;
  listIterator(start?: number): ListIterator<E>;
  reverseListIterator(start?: number): ListIterator<E>;
  replaceAll(f: (e: E) => E): void;
  indexOfFirstOccurence(predicate: Predicate<E>): number;
  indexOfLastOccurence(predicate: Predicate<E>): number;
  indexOf(item: E): number;
  lastIndexOf(item: E): number;

  reverse(): void;
  sort(comparator?: Comparator<E>): void;
  shuffle(random?: (n: number) => number): void;
}
