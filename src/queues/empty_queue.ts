import { EmptyCollection } from '../collections';
import { Queue, OverflowQueueStrategy } from './queue';

export class EmptyQueue<E> extends EmptyCollection<E> implements Queue<E> {
  private static QUEUE = new EmptyQueue();

  public static instance<T>() {
    return EmptyQueue.QUEUE as EmptyQueue<T>;
  }

  protected constructor() {
    super();
  }

  overflowStrategy(): OverflowQueueStrategy {
    return 'throw';
  }

  poll() {
    return undefined;
  }

  remove(): never {
    throw new Error(`Removing from ${this.constructor.name}`);
  }

  peek() {
    return undefined;
  }

  element(): never {
    throw new Error(`Calling element on ${this.constructor.name}`);
  }

  drain() {
    return this.iterator();
  }

  clone(): EmptyQueue<E> {
    return this;
  }
}
