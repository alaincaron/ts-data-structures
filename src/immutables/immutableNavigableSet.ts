import { ImmutableSortedSet } from './immutableSortedSet';
import { NavigableSet } from '../sets';

export class ImmutableNavigableSet<E> extends ImmutableSortedSet<E> implements NavigableSet<E> {
  constructor(delegate: NavigableSet<E>) {
    super(delegate);
  }

  protected get delegate(): NavigableSet<E> {
    return super.delegate as NavigableSet<E>;
  }

  toSet(): Set<E> {
    return this.delegate.toSet();
  }

  floor(e: E) {
    return this.delegate.floor(e);
  }

  ceiling(e: E) {
    return this.delegate.ceiling(e);
  }

  lower(e: E) {
    return this.delegate.lower(e);
  }

  higher(e: E) {
    return this.delegate.higher(e);
  }
}
