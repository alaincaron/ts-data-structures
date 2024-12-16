import { NavigableSet } from './navigable_set';
import { SortedMapBasedSet } from './sorted_map_based_set';
import { NavigableMap } from '../maps/navigable_map';

export abstract class NavigableMapBasedSet<E> extends SortedMapBasedSet<E> implements NavigableSet<E> {
  protected constructor(delegate: NavigableMap<E, boolean>) {
    super(delegate);
  }

  protected delegate() {
    return super.delegate() as NavigableMap<E, boolean>;
  }

  floor(e: E) {
    return this.delegate().floorKey(e);
  }

  ceiling(e: E) {
    return this.delegate().ceilingKey(e);
  }

  lower(e: E) {
    return this.delegate().lowerKey(e);
  }

  higher(e: E) {
    return this.delegate().higherKey(e);
  }

  pollFirst() {
    return this.delegate().pollFirstEntry()?.key;
  }

  pollLast() {
    return this.delegate().pollLastEntry()?.key;
  }

  abstract clone(): NavigableMapBasedSet<E>;
}
