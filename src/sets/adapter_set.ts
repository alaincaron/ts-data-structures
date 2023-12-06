import { Predicate } from 'ts-fluent-iterators';
import { BoundedSet } from './abstract_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { ContainerOptions, OverflowException } from '../utils';

export interface AdapterSetOptions<E> extends ContainerOptions {
  delegate?: Set<E>;
}

export class AdapterSet<E = any> extends BoundedSet<E> {
  protected readonly _delegate: Set<E>;

  constructor(options?: number | AdapterSetOptions<E>) {
    super(options);
    let delegate: Set<E> | undefined = undefined;
    if (typeof options === 'object' && 'delegate' in options) delegate = options.delegate;
    this._delegate = delegate ?? new Set<E>();
  }

  static create<E>(initializer?: number | AdapterSetOptions<E> | CollectionInitializer<E>): AdapterSet<E> {
    return buildCollection<E, AdapterSet<E>, AdapterSetOptions<E>>(AdapterSet, initializer);
  }

  protected delegate() {
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
    return AdapterSet.create<E>({ capacity: this.capacity(), initial: this });
  }
}
