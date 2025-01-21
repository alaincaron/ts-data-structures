import { FluentIterator } from 'ts-fluent-iterators';
import { EmptyCollection } from './emptyCollection';
import { isMultiSet, NavigableMultiSet } from '../multisets';

export class EmptyMultiSet<E> extends EmptyCollection<E> implements NavigableMultiSet<E> {
  private static readonly EMPTY_MULTISET = new EmptyMultiSet<never>();

  protected constructor() {
    super();
  }

  static instance<E>(): NavigableMultiSet<E> {
    return EmptyMultiSet.EMPTY_MULTISET;
  }

  equals(other: unknown) {
    if (other === this) return true;
    if (!other) return false;
    return isMultiSet(other) && other.isEmpty();
  }

  reverseIterator() {
    return FluentIterator.empty();
  }

  peekFirst() {
    return undefined;
  }

  peekLast() {
    return undefined;
  }

  count(_: E) {
    return 0;
  }

  *entries() {}

  entryIterator() {
    return FluentIterator.empty();
  }

  keyIterator() {
    return FluentIterator.empty();
  }

  *keys() {}

  nbKeys() {
    return 0;
  }

  first() {
    return undefined;
  }

  last() {
    return undefined;
  }

  firstEntry() {
    return undefined;
  }

  lastEntry() {
    return undefined;
  }

  reverseEntryIterator() {
    return FluentIterator.empty();
  }

  lowerEntry() {
    return undefined;
  }

  lower() {
    return undefined;
  }

  higherEntry() {
    return undefined;
  }

  higher() {
    return undefined;
  }

  floor(_: E) {
    return undefined;
  }

  floorEntry(_: E) {
    return undefined;
  }

  ceiling(_: E) {
    return undefined;
  }

  ceilingEntry(_: E) {
    return undefined;
  }
}
