import { EmptyCollection } from './empty_collection';
import { Collection } from './collection';
import { Queue } from './queue';

export class EmptyQueue<E> extends EmptyCollection<E> implements Queue<E> {
  private static QUEUE = new EmptyQueue();

  public static instance<T>() {
    return EmptyQueue.QUEUE as EmptyQueue<T>;
  }

  protected constructor() {
    super();
  }

  offer(_item: E) {
    return false;
  }

  offerFully<E1 extends E>(_items: E1[] | Collection<E1>) {
    return 0;
  }

  offerPartially<E1 extends E>(_items: Iterable<E1>) {
    return 0;
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

  *drain() {}

  clone(): EmptyQueue<E> {
    return this;
  }
}
