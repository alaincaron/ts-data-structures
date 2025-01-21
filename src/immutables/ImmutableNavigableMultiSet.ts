import { ImmutableSortedMultiSet } from './immutableSortedMultiSet';
import { NavigableMultiSet } from '../multisets';

export class ImmutableNavigableMultiSet<E> extends ImmutableSortedMultiSet<E> implements NavigableMultiSet<E> {
  constructor(delegate: NavigableMultiSet<E>) {
    super(delegate);
  }

  protected get delegate() {
    return super.delegate as NavigableMultiSet<E>;
  }

  lower(key: E) {
    return this.delegate.lower(key);
  }

  lowerEntry(key: E) {
    return this.delegate.lowerEntry(key);
  }

  higher(key: E) {
    return this.delegate.higher(key);
  }

  higherEntry(key: E) {
    return this.delegate.higherEntry(key);
  }

  floor(key: E) {
    return this.delegate.floor(key);
  }

  floorEntry(key: E) {
    return this.delegate.floorEntry(key);
  }

  ceiling(key: E) {
    return this.delegate.ceiling(key);
  }

  ceilingEntry(key: E) {
    return this.delegate.ceilingEntry(key);
  }
}
