import { Predicate } from '../utils';
import { CollectionLike, CollectionOptions } from './types';

export interface Collection<E> extends Iterable<E> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;
  remaining(): number;
  contains(item: E): boolean;
  toArray(): E[];
  offer(item: E): boolean;
  add(item: E): void;
  removeMatchingItem(predicate: Predicate<E>): E | undefined;
  removeItem(item: E): boolean;
  filter(predicate: Predicate<E>): boolean;
  find(predicate: Predicate<E>): E | undefined;

  all(predicate: Predicate<E>): boolean;
  some(predicate: Predicate<E>): boolean;

  addFully<E1 extends E>(items: CollectionLike<E1>): number;
  addPartially<E1 extends E>(iter: Iterable<E1>): number;
  offerFully<E1 extends E>(items: CollectionLike<E1>): number;
  offerPartially<E1 extends E>(items: Iterable<E1>): number;

  clear(): void;

  iterator(): IterableIterator<E>;

  clone(): Collection<E>;
  buildOptions(): CollectionOptions<E>;
}
