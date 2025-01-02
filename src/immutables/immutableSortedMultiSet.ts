import { ImmutableMultiSet } from './immutableMultiSet';
import { SortedMultiSet } from '../multisets';

export class ImmutableSortedMultiSet<E> extends ImmutableMultiSet<E> implements SortedMultiSet<E> {
  constructor(delegate: SortedMultiSet<E>) {
    super(delegate);
  }

  protected get delegate() {
    return super.delegate as SortedMultiSet<E>;
  }

  firstEntry() {
    return this.delegate.firstEntry();
  }

  lastEntry() {
    return this.delegate.lastEntry();
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

  reverseEntryIterator() {
    return this.delegate.reverseEntryIterator();
  }
}
