import { iterator, Iterators } from 'ts-fluent-iterators';
import { Collection, CollectionLike } from '../collections';
import { hashIterableUnordered, OverflowException } from '../utils';

function getItemsToAdd<E, E1 extends E>(set: ISet<E>, items: CollectionLike<E1>): Set<E> {
  return iterator(Iterators.toIterator(items))
    .filter(x => !set.contains(x))
    .collectToSet();
}

export abstract class ISet<E> extends Collection<E> {
  toSet() {
    return this.iterator().collectToSet();
  }

  add(item: E) {
    if (this.contains(item)) return false;
    return super.add(item);
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
