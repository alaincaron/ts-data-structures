import { ImmutableSet } from './immutableSet';
import { SortedSet } from '../sets';

export class ImmutableSortedSet<E> extends ImmutableSet<E> implements SortedSet<E> {
  constructor(delegate: SortedSet<E>) {
    super(delegate);
  }

  protected get delegate(): SortedSet<E> {
    return super.delegate as SortedSet<E>;
  }

  first() {
    return this.delegate.first();
  }

  last() {
    return this.delegate.last();
  }

  reverseIterator() {
    return this.delegate.reverseIterator();
  }

  clone() {
    return this;
  }
}
