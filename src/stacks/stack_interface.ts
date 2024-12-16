import { DequeIterator } from '../deques';
import { QueueInterface } from '../queues';

export interface StackInterface<E> extends QueueInterface<E> {
  push(item: E): StackInterface<E>;

  tryPush(item: E): boolean;

  pop(): E;

  trySwap(): boolean;

  swap(): StackInterface<E>;

  clone(): StackInterface<E>;

  queueIterator(): DequeIterator<E>;

  reverseQueueIterator(): DequeIterator<E>;
}
