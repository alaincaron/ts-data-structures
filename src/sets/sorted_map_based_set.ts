import { MapBasedSet } from './map_based_set';
import { SortedSet } from './sorted_set';
import { SortedMap } from '../maps';

export abstract class SortedMapBasedSet<E> extends MapBasedSet<E> implements SortedSet<E> {
  constructor(delegate: SortedMap<E, boolean>) {
    super(delegate);
  }

  protected delegate() {
    return super.delegate() as SortedMap<E, boolean>;
  }

  first() {
    return this.delegate().firstKey();
  }

  last() {
    return this.delegate().lastKey();
  }

  reverseIterator() {
    return this.delegate().reverseKeyIterator();
  }

  abstract clone(): SortedMapBasedSet<E>;
}
