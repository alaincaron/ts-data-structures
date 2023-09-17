import { iterator, Iterators } from 'ts-fluent-iterators';
import { ISet } from './set';
import { CollectionLike } from '../collections';

export function getItemsToAdd<E, E1 extends E>(set: ISet<E>, items: CollectionLike<E1>): Set<E> {
  return iterator(Iterators.toIterator(items))
    .distinct()
    .filter(x => !set.contains(x))
    .collectToSet();
}
