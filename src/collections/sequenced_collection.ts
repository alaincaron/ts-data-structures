import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from './collection';
import { MutableCollection } from './mutable_collection';

export interface SequencedCollection<E> extends Collection<E> {
  getFirst(): E;

  getLast(): E;

  peekFirst(): E | undefined;

  peekLast(): E | undefined;

  reverseIterator(): FluentIterator<E>;

  clone(): SequencedCollection<E>;
}

export interface SequencedMutableCollection<E> extends SequencedCollection<E>, MutableCollection<E> {
  addFirst(item: E): SequencedMutableCollection<E>;
  addLast(item: E): SequencedMutableCollection<E>;

  offerFirst(item: E): boolean;
  offerLast(item: E): boolean;

  removeFirst(): E;
  removeLast(): E;

  pollFirst(): E | undefined;
  pollLast(): E | undefined;

  reverse(): SequencedMutableCollection<E>;

  clone(): SequencedMutableCollection<E>;
}
