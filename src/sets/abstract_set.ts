import { ISet } from './set';
import { getItemsToAdd } from './utils';
import { AbstractCollection, CollectionLike } from '../collections';
import { CapacityMixin, ContainerOptions, hashIterableUnordered, OverflowException } from '../utils';

export abstract class AbstractSet<E> extends AbstractCollection<E> implements ISet<E> {
  constructor(options?: number | ContainerOptions) {
    super(options);
  }

  // TODO try to get these in a Mixin... hwoever generics and mixin don't always work together
  toSet() {
    return this.iterator().collectToSet();
  }

  add(item: E) {
    if (this.contains(item)) return false;
    return super.add(item);
  }

  // TODO mixin
  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    const initial_size = this.size();
    super.offerPartially(items);
    return this.size() - initial_size;
  }

  // TODO mixin
  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) return 0;
    return this.offerPartially(itemsToAdd);
  }

  // TODO mixin
  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getItemsToAdd(this, items);
    if (this.remaining() < itemsToAdd.size) throw new OverflowException();
    return this.addPartially(itemsToAdd);
  }

  abstract clone(): AbstractSet<E>;

  hashCode() {
    return hashIterableUnordered(this);
  }

  equals(other: any): boolean {
    if (this === other) return true;
    if (!other || typeof other !== 'object') return false;
    if (typeof other.size !== 'function' || other.size() !== this.size()) return false;
    if (typeof other[Symbol.iterator] !== 'function') return false;
    return this.containsAll(other);
  }
}

export const BoundedSet = CapacityMixin(AbstractSet);
