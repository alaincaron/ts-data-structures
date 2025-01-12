import { Comparator, Comparators, FluentIterator } from 'ts-fluent-iterators';
import { SingletonCollection } from './singletonCollection';
import { isSet, NavigableSet } from '../sets';

export class SingletonSet<E> extends SingletonCollection<E> implements NavigableSet<E> {
  constructor(
    item: E,
    private readonly comparator: Comparator<E> = Comparators.natural
  ) {
    super(item);
  }

  clone(): SingletonSet<E> {
    return this;
  }

  toReadOnly(): SingletonSet<E> {
    return this;
  }

  asReadOnly(): SingletonSet<E> {
    return this;
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return isSet(other) && other.size() === 1 && other.contains(this.item);
  }

  toSet() {
    return new Set<E>().add(this.item);
  }

  first() {
    return this.item;
  }

  last() {
    return this.item;
  }

  reverseIterator() {
    return FluentIterator.singleton(this.item);
  }

  floor(e: E): E | undefined {
    return this.comparator(e, this.item) >= 0 ? this.item : undefined;
  }

  ceiling(e: E): E | undefined {
    return this.comparator(e, this.item) <= 0 ? this.item : undefined;
  }

  lower(e: E): E | undefined {
    return this.comparator(e, this.item) > 0 ? this.item : undefined;
  }

  higher(e: E): E | undefined {
    return this.comparator(e, this.item) < 0 ? this.item : undefined;
  }
}
