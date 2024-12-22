import { emptyCollection } from './empty';
import { SingletonCollection } from './singleton';
import { ReadOnlyMultiSet } from '../multisets';

export function empty<E>(): ReadOnlyMultiSet<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): ReadOnlyMultiSet<E> {
  return new SingletonCollection(item);
}
