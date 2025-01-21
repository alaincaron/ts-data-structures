import { FluentIterator } from 'ts-fluent-iterators';
import { EmptyCollection } from './emptyCollection';
import { isSet, NavigableSet } from '../sets';

export class EmptySet<E> extends EmptyCollection<E> implements NavigableSet<E> {
  private static readonly EMPTY_SET = new EmptySet<never>();

  protected constructor() {
    super();
  }

  static instance<E>(): NavigableSet<E> {
    return EmptySet.EMPTY_SET;
  }

  toSet() {
    return new Set<E>();
  }

  equals(other: unknown) {
    if (other === this) return true;
    if (!other) return false;
    return isSet(other) && other.isEmpty();
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.empty();
  }

  first() {
    return undefined;
  }

  last() {
    return undefined;
  }

  floor(_: E) {
    return undefined;
  }

  ceiling(_: E) {
    return undefined;
  }

  lower() {
    return undefined;
  }

  higher() {
    return undefined;
  }

  count(_: E) {
    return 0;
  }

  *entries() {}
}
