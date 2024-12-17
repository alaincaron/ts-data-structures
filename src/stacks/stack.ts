import { DequeIterator } from '../deques';
import { Queue } from '../queues';

export interface Stack<E> extends Queue<E> {
  push(item: E): Stack<E>;

  tryPush(item: E): boolean;

  pop(): E;

  trySwap(): boolean;

  swap(): Stack<E>;

  clone(): Stack<E>;

  queueIterator(): DequeIterator<E>;

  reverseQueueIterator(): DequeIterator<E>;
}
