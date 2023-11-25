import { CapacityMixin, ContainerOptions, OverflowException } from '../utils';
import { AbstractCollection, CollectionLike } from '../collections';
import { ISet } from './set';
import { getItemsToAdd } from './utils';

export abstract class AbstractSet<E = any> extends AbstractCollection<E> implements ISet<E> {
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

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof AbstractSet)) return false;
    if (this.size() != other.size()) return false;
    return this.containsAll(other);
  }
}

export const BoundedSet = CapacityMixin(AbstractSet);
