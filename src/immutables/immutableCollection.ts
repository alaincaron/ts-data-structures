import { emptyCollection } from './empty';
import { SingletonCollection } from './singleton';
import { ReadOnlyCollection } from '../collections';

export function empty<E>(): ReadOnlyCollection<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): ReadOnlyCollection<E> {
  return new SingletonCollection(item);
}
