import { FluentIterator, IteratorLike, Iterators } from 'ts-fluent-iterators';
import { OverflowQueueStrategy, QueueInterface, QueueIterator } from './queue_interface';
import { Collection, CollectionLike } from '../collections';
import { getSize } from '../collections/helpers';
import { hashIterableOrdered, OverflowException, UnderflowException, WithCapacity } from '../utils';

export interface QueueOptions {
  overflowStrategy?: OverflowQueueStrategy;
}

export abstract class Queue<E> extends Collection<E> implements QueueInterface<E> {
  private readonly _overflowStrategy: OverflowQueueStrategy;
  protected constructor(options?: QueueOptions) {
    super();
    const overflowStrategy = options != null && typeof options === 'object' ? options.overflowStrategy : undefined;
    this._overflowStrategy = overflowStrategy ?? 'throw';
  }

  overflowStrategy() {
    return this._overflowStrategy;
  }

  protected handleOverflow(nbItems: number, context?: any): boolean {
    if (nbItems > 0) {
      if (context === 'offerFully') return false;
      switch (this._overflowStrategy) {
        case 'throw':
          throw new OverflowException();
        case 'overwrite':
          if (this.size() < nbItems) throw new OverflowException(); // can't free enough
          for (let i = 0; i < nbItems; ++i) this.remove();
          return true;
        case 'discard':
          return false;
        default:
          throw new Error(`Unexpected value for overflowStrategy ${this._overflowStrategy}`);
      }
    }
    return true;
  }

  // insertion
  add(item: E): boolean {
    if (this.offer(item)) return true;
    if (!this.handleOverflow(1, 'add')) return false;
    if (!this.offer(item)) throw new OverflowException();
    return true;
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
    const excess = itemsToAdd - this.remaining();
    if (excess > 0) {
      if (!this.handleOverflow(excess, 'addFully')) return 0;
      if (this.remaining() < itemsToAdd) throw new OverflowException();
    }
    return this.offerFully(items);
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    const itemsToAdd = getSize(items);
    const excess = itemsToAdd - this.remaining();
    if (excess > 0) {
      if (!this.handleOverflow(excess, 'offerFully')) return 0;
      if (this.remaining() < itemsToAdd) return 0;
    }
    return this.offerPartially(items);
  }

  offerPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    return super.offerPartially(Iterators.take(Iterators.toIterator(items), this.remaining()));
  }

  private *drainIterator() {
    while (!this.isEmpty()) {
      yield this.remove();
    }
  }

  drain() {
    return new FluentIterator(this.drainIterator());
  }

  abstract queueIterator(): QueueIterator<E>;

  buildOptions(): WithCapacity<QueueOptions> {
    return {
      overflowStrategy: this._overflowStrategy,
    };
  }

  abstract clone(): Queue<E>;

  hashCode() {
    return hashIterableOrdered(this);
  }

  equals(other: unknown) {
    return this === other;
  }
}
