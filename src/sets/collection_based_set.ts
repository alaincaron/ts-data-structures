import { Predicate } from 'ts-fluent-iterators';
import { ISet } from './set';
import { getItemsToAdd } from './utils';
import { buildCollection, Collection, CollectionInitializer, CollectionLike } from '../collections';
import { ArrayList } from '../lists';
import { ContainerOptions, OverflowException } from '../utils';

export class CollectionBasedSet<E> extends ISet<E> {
  private _delegate: Collection<E>;
  constructor(delegate: Collection<E>) {
    super();
    this._delegate = delegate;
  }

  protected delegate() {
    return this._delegate;
  }

  size(): number {
    return this._delegate.size();
  }

  capacity(): number {
    return this._delegate.capacity();
  }

  offer(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return true;
    if (d.isFull()) return false;
    return d.add(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this._delegate.removeMatchingItem(predicate);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  clear(): void {
    this._delegate.clear();
  }

  [Symbol.iterator](): Iterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  buildOptions(): ContainerOptions {
    return this._delegate.buildOptions?.() ?? {};
  }

  add(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return false;
    return d.add(item);
  }

  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    const initial_size = this.size();
    super.offerPartially(items);
    return this.size() - initial_size;
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) return 0;
    return this.offerPartially(itemsToAdd);
  }

  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) throw new OverflowException();
    return this.addPartially(itemsToAdd);
  }

  clone(): CollectionBasedSet<E> {
    return new CollectionBasedSet(this.delegate().clone());
  }
}

export class ArraySet<E> extends CollectionBasedSet<E> {
  constructor(options?: number | ContainerOptions) {
    super(new ArrayList<E>(options));
  }

  static create<E>(initializer?: number | (ContainerOptions & CollectionInitializer<E>)): ArraySet<E> {
    return buildCollection<E, ArraySet<E>>(ArraySet, initializer);
  }

  clone(): ArraySet<E> {
    return ArraySet.create({ initial: this.delegate() });
  }
}
