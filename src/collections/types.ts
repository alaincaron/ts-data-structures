import { ArrayGenerator } from 'ts-fluent-iterators';
import { Collection } from './collection';

export interface CollectionOptions {
  capacity?: number;
}

export type CollectionLike<E> = Set<E> | Array<E> | Collection<E> | ArrayGenerator<E>;

export interface CollectionInitializer<E> {
  initial?: CollectionLike<E>;
}

export function getSize<E>(items: CollectionLike<E>) {
  if (Array.isArray(items)) return items.length;
  if (items instanceof Set) return items.size;
  if (typeof (items as Collection<E>).size === 'function') return (items as Collection<E>).size();
  return (items as ArrayGenerator<E>).length;
}
