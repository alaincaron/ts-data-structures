import { FluentIterator, Predicate, Reducer } from 'ts-fluent-iterators';
import { CollectionLike } from './types';
import { ContainerOptions } from '../utils';

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
  filter(predicate: Predicate<E>): number;
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

  iterator(): FluentIterator<E>;

  containsAll<E1 extends E>(c: Iterable<E1>): boolean;
  removeAll(c: Collection<E>): number;
  retainAll(c: Collection<E>): number;

  hashCode(): number;
  equals(other: unknown): boolean;

  clone(): Collection<E>;
  toJson(): string;
  buildOptions?(): ContainerOptions;

  equals(other: unknown): boolean;
}
