import { CollectionLike } from './types';

export function getSize<E>(items: CollectionLike<E>) {
  if ('size' in items) {
    return typeof items.size === 'function' ? items.size() : items.size;
  }
  if ('length' in items) {
    return typeof items.length === 'function' ? items.length() : items.length;
  }
  throw new Error('Unable to extract number of items');
}

export function objectHasFunction(obj: any, attribute: string | symbol) {
  if (attribute in obj) {
    return typeof obj[attribute] === 'function';
  }
  return false;
}
