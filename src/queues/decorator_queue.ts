import { Queue } from './queue';
import { DecoratorCollection } from '../collections';

export abstract class DecoratorQueue<E = any> extends DecoratorCollection<E> implements Queue<E> {
  constructor(delegate: Queue<E>) {
    super(delegate);
  }

  protected delegate(): Queue<E> {
    return super.delegate() as Queue<E>;
  }

  overflowStrategy() {
    return this.delegate().overflowStrategy();
  }

  poll(): E | undefined {
    return this.delegate().poll();
  }

  remove(): E {
    return this.delegate().remove();
  }

  peek(): E | undefined {
    return this.delegate().peek();
  }

  element(): E {
    return this.delegate().element();
  }

  drain() {
    return this.delegate().drain();
  }

  abstract clone(): DecoratorQueue<E>;
}
