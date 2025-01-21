import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { EmptyCollection } from './emptyCollection';
import { List } from '../lists';
import { isList } from '../lists/helpers';
import { IndexOutOfBoundsException, parseArgs } from '../utils';

export class EmptyList<E> extends EmptyCollection<E> implements List<E> {
  private static readonly EMPTY_LIST = new EmptyList<never>();

  protected constructor() {
    super();
  }

  static instance<E>(): List<E> {
    return EmptyList.EMPTY_LIST;
  }

  getAt(_: number): never {
    throw new IndexOutOfBoundsException();
  }

  getFirst(): never {
    throw new IndexOutOfBoundsException();
  }

  getLast(): never {
    throw new IndexOutOfBoundsException();
  }

  reverseIterator() {
    return FluentIterator.empty();
  }

  listIterator(skip?: number, count?: number) {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  reverseListIterator(skip?: number, count?: number) {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  indexOfFirstOccurrence(_: Predicate<E>) {
    return -1;
  }

  indexOf(_: E) {
    return -1;
  }

  indexOfLastOccurrence(_: Predicate<E>) {
    return -1;
  }

  lastIndexOf(_: E) {
    return -1;
  }

  peekFirst() {
    return undefined;
  }

  peekLast() {
    return undefined;
  }

  equals(other: unknown) {
    if (other === this) return true;
    if (!other) return false;
    return isList(other) && other.isEmpty();
  }

  isOrdered(): boolean;
  isOrdered(arg1: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number | Comparator<E> | undefined): boolean;
  isOrdered(arg1: number, arg2: number, arg3: Comparator<E> | undefined): boolean;
  isOrdered(
    arg1?: number | Comparator<E> | undefined,
    arg2?: number | Comparator<E> | undefined,
    arg3?: Comparator<E> | undefined
  ): boolean;
  isOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    const { left, right } = parseArgs(0, arg1, arg2, arg3, Comparators.natural);
    if (left !== 0 || right !== 0) throw new IndexOutOfBoundsException();
    return true;
  }

  isStrictlyOrdered(arg1?: number | Comparator<E>, arg2?: number | Comparator<E>, arg3?: Comparator<E>) {
    return this.isOrdered(arg1, arg2, arg3);
  }
}
