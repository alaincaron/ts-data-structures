import { emptyCollection } from './empty';
import { ImmutableSet } from './helpers';
import { SingletonCollection } from './singleton';
import { CollectionLike } from '../collections';
import { ArraySet, ISet, LinkedHashSet, MutableSet } from '../sets';

export function empty<E>(): ISet<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): ISet<E> {
  return new SingletonCollection(item);
}

export function hashCopyOf<E>(...items: E[]) {
  const delegate = LinkedHashSet.create({ initial: items });
  return new ImmutableSet(delegate);
}

export function copyOf<E>(...items: E[]) {
  const delegate = ArraySet.create({ initial: items });
  return new ImmutableSet(delegate);
}

export function hashCopy<E>(items: CollectionLike<E>): ISet<E> {
  const delegate = new LinkedHashSet<E>();
  delegate.addFully(items);
  return new ImmutableSet(delegate);
}

export function copy<E>(items: CollectionLike<E>): ISet<E> {
  const delegate = new LinkedHashSet<E>();
  delegate.addFully(items);
  return new ImmutableSet(delegate);
}

export function asReadOnly<E>(items: MutableSet<E>): ISet<E> {
  if ('add' in items) {
    return new ImmutableSet<E>(items);
  }
  return items as ISet<E>;
}
