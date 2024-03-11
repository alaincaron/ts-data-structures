import { getItemsToAdd } from './utils';
import { Collection, CollectionLike } from '../collections';
import { hashIterableUnordered, OverflowException } from '../utils';

export abstract class ISet<E> extends Collection<E> {
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
    return this.offerPartially(itemsToAdd);
  }

  abstract clone(): ISet<E>;

  hashCode() {
    return hashIterableUnordered(this);
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof ISet)) return false;
    if (other.size() !== this.size()) return false;
    return this.containsAll(other);
  }
}
