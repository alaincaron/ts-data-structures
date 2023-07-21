import { OverflowException, UnderflowException } from '../utils';
import { AbstractCollection, Collection } from '../collections';
import { Queue } from './queue';

export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
  // insertion
  abstract offer(item: E): boolean;

  add(item: E) {
    if (!this.offer(item)) throw new OverflowException();
  }

  offerFully<E1 extends E>(items: E1[] | Collection<E1>): number {
    const itemsToAdd = Array.isArray(items) ? items.length : items.size();
    if (this.remaining() < itemsToAdd) return 0;
    for (const item of items) this.add(item);
    return itemsToAdd;
  }

  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    let count = 0;
    for (const item of items) {
      if (!this.offer(item)) break;
      ++count;
    }
    return count;
  }

  // removal
  abstract poll(): E | undefined;
  remove(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.poll()!;
  }

  // inspection
  abstract peek(): E | undefined;

  element(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.peek()!;
  }

  *drain() {
    while (!this.isEmpty()) {
      yield this.remove();
    }
  }

  abstract clone(): AbstractQueue<E>;
}
