import { AbstractList } from './abstract_list';
import { List } from './list';
import { MutableList } from './mutable_list';
import { isCollection } from '../collections';
import { ImmutableList } from '../immutables';
import { IllegalArgumentException, IndexOutOfBoundsException, Objects } from '../utils';

export function checkListBounds<E>(list: List<E>, start: number, end: number) {
  checkListBoundForAdd(list, start);
  checkListBoundForAdd(list, end);
  if (start > end) {
    throw new IllegalArgumentException(`Argument start ${start} must be at least as argument end ${end}`);
  }
}

export function checkListBound<E>(list: List<E>, idx: number) {
  if (idx < 0 || idx >= list.size()) throw new IndexOutOfBoundsException();
}

export function checkListBoundForAdd<E>(list: List<E>, idx: number) {
  if (idx < 0 || idx > list.size()) throw new IndexOutOfBoundsException();
}

export function computeListIteratorBounds<E>(list: List<E>, skip?: number, count?: number) {
  skip ??= 0;
  checkListBoundForAdd(list, skip);
  count ??= list.size() - skip;
  if (count < 0 || count + skip > list.size()) {
    throw new IndexOutOfBoundsException(`Invalid skip = ${skip}, count = ${count}, size = ${list.size()}`);
  }
  return { start: skip, count };
}

export function computeListReverseIteratorBounds<E>(list: List<E>, skip?: number, count?: number) {
  skip ??= 0;
  checkListBoundForAdd(list, skip);
  const start = list.size() - 1 - skip;
  count ??= start + 1;
  if (count < 0 || count > start + 1) {
    throw new IndexOutOfBoundsException(
      `Reverse iterator invalid skip = ${skip}, count = ${count}, size= ${list.size()}`
    );
  }
  return { start, count };
}

export function isList<E>(obj: unknown): obj is List<E> {
  if (obj instanceof AbstractList || obj instanceof ImmutableList) return true;
  if (!isCollection(obj)) return false;
  if (!Objects.hasFunction(obj, 'getAt')) return false;
  return true;
}

export function isWritableList<E>(obj: unknown): obj is MutableList<E> {
  return isList(obj) && Objects.hasFunction(obj, 'setAt');
}

export function isReadOnlyList<E>(obj: unknown): obj is List<E> {
  return isList(obj) && !Objects.hasFunction(obj, 'setAt');
}
