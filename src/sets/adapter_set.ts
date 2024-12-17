import { Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { OverflowException, WithCapacity } from '../utils';

export interface AdapterSetOptions<E> {
  delegate?: Set<E>;
}

export class AdapterSet<E> extends AbstractSet<E> {
  private readonly _delegate: Set<E>;

  constructor(options?: AdapterSetOptions<E>) {
    super();
    this._delegate = options?.delegate ?? new Set();
  }

  static create<E>(initializer?: WithCapacity<AdapterSetOptions<E> | CollectionInitializer<E>>): AdapterSet<E> {
    return buildCollection<E, AdapterSet<E>, AdapterSetOptions<E>>(AdapterSet, initializer);
  }

  delegate() {
    return this._delegate;
  }

  size() {
    return this._delegate.size;
  }

  offer(item: E) {
    if (this.isFull() && !this._delegate.has(item)) return false;
    this._delegate.add(item);
    return true;
  }

  add(item: E) {
    const initial_size = this.size();
    if (!this.offer(item)) throw new OverflowException();
    return this.size() > initial_size;
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    for (const value of this._delegate) {
      if (predicate(value)) {
        this._delegate.delete(value);
        return value;
      }
    }
    return undefined;
  }

  filter(predicate: Predicate<E>): number {
    let count = 0;
    for (const value of this._delegate) {
      if (!predicate(value)) {
        this._delegate.delete(value);
        ++count;
      }
    }
    return count;
  }

  clear() {
    this._delegate.clear();
    return this;
  }

  [Symbol.iterator]() {
    return this._delegate[Symbol.iterator]();
  }

  clone(): AdapterSet<E> {
    return AdapterSet.create({ initial: this });
  }
}

declare global {
  // eslint-disable-next-line
  interface Set<T> {
    equals(other: unknown): boolean;
    asISet(): AdapterSet<T>;
  }
}

Set.prototype.asISet = function () {
  return AdapterSet.create({ delegate: this });
};

Set.prototype.equals = function (other: unknown) {
  if (this === other) return true;
  if (other instanceof Set) {
    return this.asISet().equals(other.asISet());
  }
  return false;
};
