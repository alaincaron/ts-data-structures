import { Queue } from '../queues';

export interface Stack<E = any> extends Queue<E> {
  push(item: E): void;
  tryPush(item: E): boolean;
  pop(): E;
  trySwap(): boolean;
  swap(): void;
  clone(): Stack<E>;
}
