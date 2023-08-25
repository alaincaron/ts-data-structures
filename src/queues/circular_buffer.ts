import { AbstractQueue, QueueOptions } from './abstract_queue';
import { ForwardingQueue } from './forwarding_queue';
import { ArrayDeque } from '../deques';
import { CollectionInitializer } from '../collections';

export class CircularBuffer<E> extends ForwardingQueue<E> {
  protected constructor(options?: number | QueueOptions<E> | ArrayDeque<E>) {
    super(options instanceof ArrayDeque ? options : ArrayDeque.create(options));
  }

  static create<E>(initializer?: number | (QueueOptions<E> & CollectionInitializer<E>)) {
    return AbstractQueue.buildCollection<E, CircularBuffer<E>, QueueOptions<E>, CollectionInitializer<E>>(
      options => new CircularBuffer(options),
      initializer
    );
  }

  clone(): CircularBuffer<E> {
    return new CircularBuffer((this.delegate() as ArrayDeque<E>).clone());
  }
}
