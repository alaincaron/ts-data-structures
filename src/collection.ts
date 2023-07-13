import { Predicate } from './types';

export interface Collection<E> extends Iterable<E> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;
  remaining(): number;
  contains(item: E): boolean;
  toArray(): E[];
  add(item: E): boolean;
  removeMatchingItem(predicate: Predicate<E>): E | undefined;
  removeItem(item: E): boolean;
  filter(predicate: Predicate<E>): boolean;
  find(predicate: Predicate<E>): E | undefined;

  all(predicate: Predicate<E>): boolean;
  some(predicate: Predicate<E>): boolean;

  addMany<E1 extends E>(items: E1[] | Collection<E1> | Iterable<E1>): number;
  addAll<E1 extends E>(iter: Iterable<E1>): number;

  clear(): void;

  iterator(): IterableIterator<E>;

  clone(): Collection<E>;
}
