import { UnderflowException, OverflowException } from '../utils';
import { AbstractCollection, CollectionOptions } from '../collections';
import { Queue } from './queue';

export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
  }

  protected handleOverflow(nbItems: number, _context?: any) {
    if (nbItems > 0) throw new OverflowException();
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

  *drain() {
    while (!this.isEmpty()) {
      yield this.remove();
    }
  }

  abstract clone(): AbstractQueue<E>;
}
