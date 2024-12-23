import { Comparator, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { SequencedCollection } from '../collections';

export interface List<E> extends SequencedCollection<E> {
  getAt(idx: number): E;

  getFirst(): E;

  getLast(): E;

  reverseIterator(): FluentIterator<E>;

  listIterator(): FluentIterator<E>;
  reverseListIterator(): FluentIterator<E>;

  listIterator(skip?: number, count?: number): FluentIterator<E>;
  reverseListIterator(skip?: number, count?: number): FluentIterator<E>;

  indexOfFirstOccurrence(predicate: Predicate<E>): number;

  indexOf(e: E): number;

  indexOfLastOccurrence(predicate: Predicate<E>): number;

  lastIndexOf(e: E): number;

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

  clone(): List<E>;
}
