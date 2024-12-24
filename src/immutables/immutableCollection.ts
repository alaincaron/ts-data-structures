import { emptyCollection } from './empty';
import { ImmutableCollection } from './helpers';
import { SingletonCollection } from './singleton';
import { AbstractCollection, Collection, MutableCollection } from '../collections';
import { Objects } from '../utils';

export function empty<E>(): Collection<E> {
  return emptyCollection();
}

export function singleton<E>(item: E): Collection<E> {
  return new SingletonCollection(item);
}

export function asReadOnly<E>(items: Collection<E>): Collection<E> {
  if (isReadOnlyCollection<E>(items)) return items;
  return new ImmutableCollection<E>(items);
}

export function isCollection<E>(obj: unknown): obj is Collection<E> {
  if (!obj || typeof obj !== 'object') return false;
  if (obj instanceof AbstractCollection || obj instanceof ImmutableCollection) return true;
  if (!Objects.hasFunction(obj, 'size')) return false;
  if (!Objects.hasFunction(obj, 'contains')) return false;
  return true;
}

export function isWritableCollection<E>(obj: unknown): obj is MutableCollection<E> {
  return isCollection(obj) && Objects.hasFunction(obj, 'offer');
}

export function isReadOnlyCollection<E>(obj: unknown): obj is Collection<E> {
  return isCollection(obj) && !Objects.hasFunction(obj, 'offer');
}
