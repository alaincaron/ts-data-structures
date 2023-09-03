import { Collection } from '../collections';
import { Comparator, RandomAccess, Predicate } from '../utils';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;
  remove(): E;
  previous(): IteratorResult<E>;
}

export interface List<E> extends Collection<E>, RandomAccess<E> {
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

  listIterator(start?: number): ListIterator<E>;
  reverseListIterator(start?: number): ListIterator<E>;
  replaceAll(f: (e: E) => E): void;
  sort(comparator?: Comparator<E>): void;
  indexOf(item: E): number;
  lastIndexOf(item: E): number;
}
