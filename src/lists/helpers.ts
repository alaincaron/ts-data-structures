import { AbstractList } from './abstract_list';
import { List } from './list';
import { ReadOnlyList } from './readonly_list';
import { ImmutableList } from '../immutables/helpers';
import { Objects } from '../utils';

export function isList<E>(obj: unknown): obj is ReadOnlyList<E> {
  if (!obj || typeof obj !== 'object') return false;
  if (obj instanceof AbstractList || obj instanceof ImmutableList) return true;
  if (!Objects.hasFunction(obj, 'size')) return false;
  if (!Objects.hasFunction(obj, 'getAt')) return false;
  return true;
}

export function isWritableList<E>(obj: unknown): obj is List<E> {
  return isList(obj) && Objects.hasFunction(obj, 'setAt');
}

export function isReadOnlyList<E>(obj: unknown): obj is List<E> {
  return isList(obj) && !Objects.hasFunction(obj, 'setAt');
}
