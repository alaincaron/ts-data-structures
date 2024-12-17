import { Stack } from './stack';
import { DequeIterator } from '../deques';
import { AbstractQueue, QueueOptions } from '../queues';
import { UnderflowException } from '../utils';

export abstract class AbstractStack<E> extends AbstractQueue<E> implements Stack<E> {
  protected constructor(options?: QueueOptions) {
    super(options);
  }

  push(item: E): AbstractStack<E> {
    this.add(item);
    return this;
  }

  tryPush(item: E): boolean {
    return this.offer(item);
  }

  pop(): E {
    return this.remove();
  }

  trySwap(): boolean {
    if (this.size() >= 2) {
      const a = this.pop();
      const b = this.pop();
      this.push(a);
      this.push(b);
      return true;
    }
    return false;
  }

  swap(): AbstractStack<E> {
    if (!this.trySwap()) throw new UnderflowException('Need at least two elements for a swap');
    return this;
  }

  abstract clone(): AbstractStack<E>;

  abstract queueIterator(): DequeIterator<E>;

  abstract reverseQueueIterator(): DequeIterator<E>;
}
