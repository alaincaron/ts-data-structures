import { emptyCollection } from './empty';
import { ImmutableList } from './helpers';
import { SingletonCollection } from './singleton';
import { CollectionLike } from '../collections';
import { AdapterArrayList, ReadOnlyList } from '../lists';
import { isReadOnlyList } from '../lists/helpers';

export function empty<E>(): ReadOnlyList<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): ReadOnlyList<E> {
  return new SingletonCollection(item);
}

export function copyOf<E>(...items: E[]): ReadOnlyList<E> {
  return new ImmutableList(AdapterArrayList.create<E>({ initial: items }));
}

export function copy<E>(items: CollectionLike<E>): ReadOnlyList<E> {
  if (isReadOnlyList<E>(items)) return items;
  const delegate = new AdapterArrayList<E>();
  delegate.addFully(items);
  return new ImmutableList(delegate);
}

export function asReadOnly<E>(items: ReadOnlyList<E> | E[]): ReadOnlyList<E> {
  if (Array.isArray(items)) {
    return new ImmutableList(new AdapterArrayList({ delegate: items }));
  }
  if (isReadOnlyList<E>(items)) return items;
  return new ImmutableList<E>(items);
}
