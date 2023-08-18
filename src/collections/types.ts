import { BinaryPredicate } from '../utils';
import { Collection } from './collection';

export interface ArrayLike<E> {
  length: number;
  seed: ((i: number) => E) | Iterator<E> | Iterable<E>;
}

export interface CollectionOptions<E> {
  capacity?: number;
  initial?: Array<E> | Collection<E> | ArrayLike<E>;
  equals?: BinaryPredicate<E>;
}

function toIterator<E>(arrayLike: ArrayLike<E>): Iterator<E> {
  const seed: any = arrayLike.seed;
  if (typeof seed === 'function') {
    let i = 0;
    return {
      next: () => {
        const value = i < arrayLike.length ? seed(i) : undefined;
        ++i;
        return { done: value === undefined, value };
      },
    };
  }
  if (typeof seed?.next === 'function') {
    return seed as Iterator<E>;
  } else if (typeof seed?.[Symbol.iterator] === 'function') {
    return (seed as Iterable<E>)[Symbol.iterator]();
  }
  throw new Error('Unable to convert object into an Iterator');
}

export function initArrayLike<E>(elements: Array<E>, arrayLike: ArrayLike<E>): number {
  const iter = toIterator(arrayLike);
  let i = 0;
  while (i < arrayLike.length) {
    const item = iter.next();
    if (item.done) break;
    elements[i++] = item.value;
  }
  return i;
}
