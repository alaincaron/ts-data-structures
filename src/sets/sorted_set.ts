import { ISet } from './set';

export interface SortedSet<E> extends ISet<E> {
  first(): E | undefined;
  last(): E | undefined;
}
