import { AbstractCollection } from './abstract_collection';
import { Collection } from './collection';
import { MutableCollection } from './mutable_collection';
import { ImmutableCollection } from '../immutables';
import { Objects } from '../utils';

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
  return isCollection(obj) && collectionIsReadOnly(obj);
}

export function collectionIsReadOnly<E>(col: Collection<E>): boolean {
  return !Objects.hasFunction(col, 'offer');
}
