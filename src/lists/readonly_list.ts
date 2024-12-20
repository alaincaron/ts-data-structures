import { Comparator, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyCollection } from '../collections';

export interface ReadOnlyList<E> extends ReadOnlyCollection<E> {
  getAt(idx: number): E;

  getFirst(): E;

  getLast(): E;

  reverseIterator(): FluentIterator<E>;

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

  clone(): ReadOnlyList<E>;
}
