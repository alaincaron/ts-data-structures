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

  getAt(_: number): E {
    throw new IndexOutOfBoundsException();
  }

  getFirst(): E {
    throw new IndexOutOfBoundsException();
  }

  getLast(): E {
    throw new IndexOutOfBoundsException();
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.empty();
  }

  listIterator(skip?: number, count?: number): FluentIterator<E> {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  reverseListIterator(skip?: number, count?: number): FluentIterator<E> {
    if (skip || count) throw new IndexOutOfBoundsException('Empty list');
    return FluentIterator.empty();
  }

  indexOfFirstOccurrence(_: Predicate<E>): number {
    return -1;
  }

  indexOf(_: E): number {
    return -1;
  }

  indexOfLastOccurrence(_: Predicate<E>): number {
    return -1;
  }

  lastIndexOf(_: E): number {
    return -1;
  }

  peekFirst(): E | undefined {
    return undefined;
  }

  peekLast(): E | undefined {
    return undefined;
  }

  equals(other: unknown): boolean {
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

  clone() {
    return this;
  }

  toReadOnly() {
    return this;
  }

  asReadOnly() {
    return this;
  }
}
