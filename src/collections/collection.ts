import { Predicate, Reducer } from '../utils';
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
  add(item: E): boolean;
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

  forEach(f: (item: E) => any): void;
  fold<B>(reducer: Reducer<E, B>, initialValue: B): B;
  reduce(reducer: Reducer<E, E>, initialValue?: E): E | undefined;

  iterator(): IterableIterator<E>;

  clone(): Collection<E>;
  buildOptions(): CollectionOptions<E>;
}
