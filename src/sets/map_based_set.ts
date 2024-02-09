import { Predicate } from 'ts-fluent-iterators';
import { ISet } from './set';
import { IMap } from '../maps';

export abstract class MapBasedSet<E> extends ISet<E> {
  constructor(private readonly _delegate: IMap<E, boolean>) {
    super();
  }

  protected delegate() {
    return this._delegate;
  }

  size() {
    return this._delegate.size();
  }

  capacity() {
    return this._delegate.capacity();
  }

  clear() {
    this._delegate.clear();
  }

  offer(item: E) {
    return this._delegate.offer(item, true).accepted;
  }

  add(item: E) {
    return !this._delegate.put(item, true);
  }

  contains(item: E) {
    return this._delegate.containsKey(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    for (const k of this._delegate.keys()) {
      if (predicate(k)) {
        this._delegate.remove(k);
        return k;
      }
    }
    return undefined;
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filterKeys(predicate);
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this._delegate.keys();
  }

  abstract clone(): MapBasedSet<E>;

  buildOptions() {
    return this._delegate.buildOptions();
  }
}
