import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from './collection';

export interface SequencedCollection<E> extends Collection<E> {
  addFirst(item: E): SequencedCollection<E>;
  addLast(item: E): SequencedCollection<E>;

  offerFirst(item: E): boolean;
  offerLast(item: E): boolean;

  getFirst(): E;
  getLast(): E;

  removeFirst(): E;
  removeLast(): E;

  pollFirst(): E | undefined;
  pollLast(): E | undefined;

  peekFirst(): E | undefined;
  peekLast(): E | undefined;

  reverse(): SequencedCollection<E>;
  reverseIterator(): FluentIterator<E>;
}
