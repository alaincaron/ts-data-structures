import { UnderflowException, OverflowException, ContainerOptions, CapacityMixin } from '../utils';
import { FluentIterator, IteratorLike, Iterators } from 'ts-fluent-iterators';
import { AbstractCollection, CollectionLike, getSize } from '../collections';
import { Queue, OverflowQueueStrategy } from './queue';

export interface QueueOptions extends ContainerOptions {
  overflowStrategy?: OverflowQueueStrategy;
}

export abstract class AbstractQueue<E = any> extends AbstractCollection<E> implements Queue<E> {
  private readonly _overflowStrategy: OverflowQueueStrategy;
  constructor(options?: number | QueueOptions) {
    super(options);
    this._overflowStrategy = (options as QueueOptions)?.overflowStrategy ?? 'throw';
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
    return this.addPartially(items);
  }

  addPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    return super.addPartially(Iterators.take(Iterators.toIterator(items), this.remaining()));
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

  buildOptions(): QueueOptions {
    return {
      overflowStrategy: this._overflowStrategy,
    };
  }

  abstract clone(): AbstractQueue<E>;

  equals(other: unknown) {
    return this === other;
  }
}

export const BoundedQueue = CapacityMixin(AbstractQueue);
