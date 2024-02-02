import { ArrayGenerator } from 'ts-fluent-iterators';
import { Collection } from './collection';
import { CollectionLike } from './types';

export function getSize<E>(items: CollectionLike<E>) {
  if (Array.isArray(items)) return items.length;
  if (items instanceof Set) return items.size;
  if (items instanceof Collection) return items.size();
  return (items as ArrayGenerator<E>).length;
}
