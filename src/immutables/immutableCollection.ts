import { emptyCollection } from './empty';
import { SingletonCollection } from './singleton';
import { Collection } from '../collections';

export function empty<E>(): Collection<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): Collection<E> {
  return new SingletonCollection(item);
}
