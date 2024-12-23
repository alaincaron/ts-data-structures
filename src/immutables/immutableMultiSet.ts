import { emptyCollection } from './empty';
import { SingletonCollection } from './singleton';
import { MultiSet } from '../multisets';

export function empty<E>(): MultiSet<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): MultiSet<E> {
  return new SingletonCollection(item);
}
