import { FluentIterator } from 'ts-fluent-iterators';
import { SingletonCollection } from './singletonCollection';
import { isSet, SortedSet } from '../sets';

export class SingletonSet<E> extends SingletonCollection<E> implements SortedSet<E> {
  constructor(item: E) {
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
}
