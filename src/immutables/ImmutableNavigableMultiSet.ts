import { ImmutableSortedMultiSet } from './immutableSortedMultiSet';
import { MultiSetEntry, NavigableMultiSet } from '../multisets';

export class ImmutableNavigableMultiSet<E> extends ImmutableSortedMultiSet<E> implements NavigableMultiSet<E> {
  constructor(delegate: NavigableMultiSet<E>) {
    super(delegate);
  }
  protected get delegate() {
    return super.delegate as NavigableMultiSet<E>;
  }

  lower(key: E): E | undefined {
    return this.delegate.lower(key);
  }

  lowerEntry(key: E): MultiSetEntry<E> | undefined {
    return this.delegate.lowerEntry(key);
  }
  higher(key: E): E | undefined {
    return this.delegate.higher(key);
  }

  higherEntry(key: E): MultiSetEntry<E> | undefined {
    return this.delegate.higherEntry(key);
  }

  floor(key: E): E | undefined {
    return this.delegate.floor(key);
  }

  floorEntry(key: E): MultiSetEntry<E> | undefined {
    return this.delegate.floorEntry(key);
  }

  ceiling(key: E): E | undefined {
    return this.delegate.ceiling(key);
  }

  ceilingEntry(key: E): MultiSetEntry<E> | undefined {
    return this.delegate.ceilingEntry(key);
  }
}
