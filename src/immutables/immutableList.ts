import { emptyCollection } from './empty';
import { ImmutableList } from './helpers';
import { SingletonCollection } from './singleton';
import { CollectionLike } from '../collections';
import { AdapterArrayList, List } from '../lists';
import { isReadOnlyList } from '../lists/helpers';

export function empty<E>(): List<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): List<E> {
  return new SingletonCollection(item);
}

export function copyOf<E>(...items: E[]): List<E> {
  return new ImmutableList(AdapterArrayList.create({ initial: items }));
}

export function copy<E>(items: CollectionLike<E>): List<E> {
  if (isReadOnlyList<E>(items)) return items;
  const delegate = new AdapterArrayList<E>();
  delegate.addFully(items);
  return new ImmutableList(delegate);
}

export function asReadOnly<E>(items: List<E> | E[]): List<E> {
  if (Array.isArray(items)) {
    return new ImmutableList(new AdapterArrayList({ delegate: items }));
  }
  if (isReadOnlyList<E>(items)) return items;
  return new ImmutableList<E>(items);
}
