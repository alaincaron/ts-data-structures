import { iterator, Iterators } from 'ts-fluent-iterators';
import { ISet, MutableSet } from './set_interface';
import {
  AbstractCollection,
  CollectionLike,
  isCollection,
  isReadOnlyCollection,
  isWritableCollection,
} from '../collections';
import { ImmutableSet } from '../immutables';
import { Immutable } from '../immutables';
import { hashIterableUnordered, Objects, OverflowException } from '../utils';

function getItemsToAdd<E, E1 extends E>(set: MutableSet<E>, items: CollectionLike<E1>): Set<E> {
  return iterator(Iterators.toIterator(items))
    .filter(x => !set.contains(x))
    .collectToSet();
}

export abstract class AbstractSet<E> extends AbstractCollection<E> implements MutableSet<E> {
  toSet() {
    return this.iterator().collectToSet();
  }

  abstract clear(): AbstractSet<E>;

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

  toReadOnly(): ISet<E> {
    return Immutable.toSet(this);
  }

  asReadOnly(): ISet<E> {
    return Immutable.asReadOnlySet(this);
  }

  abstract clone(): AbstractSet<E>;

  hashCode() {
    return hashIterableUnordered(this);
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!isSet<E>(other)) return false;
    if (other.size() !== this.size()) return false;
    return this.containsAll(other);
  }
}

export function isSet<E>(obj: unknown): obj is ISet<E> {
  if (!isCollection(obj)) return false;
  if (obj instanceof AbstractSet || obj instanceof ImmutableSet) return true;
  if (!Objects.hasFunction(obj, 'toSet')) return false;
  return true;
}
export function isWritableSet<E>(obj: unknown): obj is MutableSet<E> {
  return isWritableCollection(obj) && isSet(obj);
}

export function isReadonlySet<E>(obj: unknown): obj is ISet<E> {
  return isReadOnlyCollection(obj) && isSet(obj);
}
