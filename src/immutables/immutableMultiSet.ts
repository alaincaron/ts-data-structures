import { emptyCollection } from './empty';
import { ImmutableMultiSet } from './helpers';
import { SingletonCollection } from './singleton';
import { CollectionLike } from '../collections';
import { LinkedHashMultiSet, MultiSet, MutableMultiSet } from '../multisets';

export function empty<E>(): MultiSet<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): MultiSet<E> {
  return new SingletonCollection(item);
}

export function copyOf<E>(...items: E[]): MultiSet<E> {
  const delegate = LinkedHashMultiSet.create({ initial: items });
  return new ImmutableMultiSet(delegate);
}

export function copy<E>(items: CollectionLike<E>): MultiSet<E> {
  const delegate = new LinkedHashMultiSet<E>();
  delegate.addFully(items);
  return new ImmutableMultiSet(delegate);
}

export function asReadOnly<E>(items: MutableMultiSet<E>): MultiSet<E> {
  if ('add' in items) {
    return new ImmutableMultiSet<E>(items);
  }
  return items as MultiSet<E>;
}
