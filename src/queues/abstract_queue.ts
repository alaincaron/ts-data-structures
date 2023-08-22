import { UnderflowException, OverflowException, IteratorLike } from '../utils';
import { AbstractCollection, CollectionOptions, CollectionLike, getSize, toIterator, take } from '../collections';
import { Queue } from './queue';

export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
  }

  protected handleOverflow(nbItems: number, context?: any) {
    if (nbItems > 0) {
      if (context === 'offerFully') return;
      throw new OverflowException();
    }
  }

  // insertion
  add(item: E) {
    if (this.offer(item)) return;
    this.handleOverflow(1);
    if (!this.offer(item)) throw new OverflowException();
  }

  abstract offer(item: E): boolean;

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

  // bulk
  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    return this.addPartially(items);
  }

  addPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    return super.addPartially(take(this.remaining(), toIterator(items)));
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    if (this.remaining() < itemsToAdd) return 0;
    return this.offerPartially(items);
  }

  offerPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    return super.offerPartially(take(this.remaining(), toIterator(items)));
  }

  *drain() {
    while (!this.isEmpty()) {
      yield this.remove();
    }
  }

  abstract clone(): AbstractQueue<E>;
}
