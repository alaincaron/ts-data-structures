import { FluentIterator } from 'ts-fluent-iterators';
import { Count } from './map_based_multi_set';
import { SortedMultiSet } from './sorted_multi_set';
import { MapEntry, NavigableMap, SortedMapOptions } from '../maps';

export abstract class NavigableMultiSet<E> extends SortedMultiSet<E> {
  constructor(
    mapFactory: NavigableMap<E, Count> | (new () => NavigableMap<E, Count>),
    options?: number | SortedMapOptions<E>
  ) {
    super(mapFactory, options);
  }

  protected delegate() {
    return this.map as NavigableMap<E, Count>;
  }

  lower(key: E) {
    return this.delegate().lowerKey(key);
  }

  lowerEntry(key: E) {
    const e = this.delegate().lowerEntry(key);
    return e && { key: e.key, value: e.value.count };
  }

  higher(key: E) {
    return this.delegate().higherKey(key);
  }

  higherEntry(key: E) {
    const e = this.delegate().higherEntry(key);
    return e && { key: e.key, value: e.value.count };
  }

  floor(key: E) {
    return this.delegate().floorKey(key);
  }

  floorEntry(key: E) {
    const e = this.delegate().floorEntry(key);
    return e && { key: e.key, value: e.value.count };
  }

  ceiling(key: E) {
    return this.delegate().ceilingKey(key);
  }

  ceilingEntry(key: E) {
    const e = this.delegate().ceilingEntry(key);
    return e && { key: e.key, value: e.value.count };
  }

  pollFirstEntry() {
    const e = this.delegate().pollFirstEntry();
    return e && { key: e.key, value: e.value.count };
  }

  pollLastEntry() {
    const e = this.delegate().pollLastEntry();
    return e && { key: e.key, value: e.value.count };
  }

  pollFirst() {
    const e = this.delegate().firstEntry();
    if (!e) return undefined;
    this.removeItem(e.key);
    return e.key;
  }

  pollLast() {
    const e = this.delegate().lastEntry();
    if (!e) return undefined;
    this.removeItem(e.key);
    return e.key;
  }

  reverseEntryIterator(): FluentIterator<MapEntry<E, number>> {
    return this.delegate()
      .reverseEntryIterator()
      .map(e => ({ key: e.key, value: e.value.count }));
  }

  reverseIterator(): FluentIterator<E> {
    return this.delegate().reverseKeyIterator();
  }

  abstract clone(): NavigableMultiSet<E>;
}
