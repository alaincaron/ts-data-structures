import { Queue } from './queue';

export interface Stack<E> extends Queue<E> {
  push(item: E): void;
  tryPush(item: E): boolean;
  pop(): E;
  trySwap(): boolean;
  swap(): void;
  clone(): Stack<E>;
}
