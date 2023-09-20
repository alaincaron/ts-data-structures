import { AbstractSet } from './abstract_set';
import { Predicate } from 'ts-fluent-iterators';

export class AdapterSet<E = any> extends AbstractSet<E> {
  private readonly _delegate: Set<E>;
  constructor(delegate?: Set<E>) {
    super();
    this._delegate = delegate ?? new Set<E>();
  }

  protected delegate() {
    return this._delegate;
  }

  size() {
    return this._delegate.size;
  }

  capacity() {
    return Infinity;
  }

  offer(item: E) {
    this._delegate.add(item);
    return true;
  }

  add(item: E) {
    const initial_size = this.size();
    this._delegate.add(item);
    return this.size() > initial_size;
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    for (const value of this) {
      if (predicate(value)) {
        this._delegate.delete(value);
        return value;
      }
    }
    return undefined;
  }

  filter(predicate: Predicate<E>): number {
    let count = 0;
    for (const value of this) {
      if (!predicate(value)) {
        this._delegate.delete(value);
        ++count;
      }
    }
    return count;
  }

  clear() {
    this._delegate.clear();
  }

  [Symbol.iterator]() {
    return this._delegate[Symbol.iterator]();
  }

  toSet() {
    return this._delegate;
  }

  clone(): AdapterSet<E> {
    return new AdapterSet<E>(new Set(this._delegate));
  }
}
