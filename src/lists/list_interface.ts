import { FluentIterator, Mapper, Predicate } from 'ts-fluent-iterators';
import { CollectionInterface } from '../collections';

export interface ListIterator<E> extends IterableIterator<E> {
  setValue(item: E): E;

  remove(): E;
}

export interface ListInterface<E> extends CollectionInterface<E> {
  getAt(idx: number): E;

  getFirst(): any;

  getLast(): any;

  offerAt(idx: number, item: E): boolean;

  addAt(idx: number, item: E): ListInterface<E>;

  offerFirst(item: E): any;

  addFirst(item: E): ListInterface<E>;

  offerLast(item: E): any;

  addLast(item: E): ListInterface<E>;

  setAt(idx: number, item: E): E;

  removeAt(idx: number): E;

  removeRange(start: number, end?: number): ListInterface<E>;

  removeFirst(): E;

  removeLast(): E;

  reverseIterator(): FluentIterator<unknown>;

  listIterator(skip?: number, count?: number): ListIterator<E>;

  transform(mapper: Mapper<E, E>): ListInterface<E>;

  reverseListIterator(skip?: number, count?: number): ListIterator<E>;

  replaceIf(predicate: Predicate<E>, f: Mapper<E, E>): ListInterface<E>;

  replaceAll(f: Mapper<E, E>): void;

  indexOfFirstOccurrence(predicate: Predicate<E>): number;

  clone(): ListInterface<E>;
}
