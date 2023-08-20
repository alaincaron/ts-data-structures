import { UnderflowException } from '../utils';
import { AbstractCollection, CollectionOptions } from '../collections';
import { Queue } from './queue';

export abstract class AbstractQueue<E> extends AbstractCollection<E> implements Queue<E> {
  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
  }

  // insertion
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
