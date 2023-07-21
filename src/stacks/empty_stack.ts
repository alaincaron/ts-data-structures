import { EmptyQueue } from '../queues';
import { Stack } from './stack';

export class EmptyStack<E> extends EmptyQueue<E> implements Stack<E> {
  private static STACK = new EmptyStack();

  public static instance<T>() {
    return EmptyStack.STACK as EmptyStack<T>;
  }

  protected constructor() {
    super();
  }

  push(_: E) {
    throw new Error(`Calling push on ${this.constructor.name}`);
  }

  pop(): never {
    throw new Error(`Calling pop on ${this.constructor.name}`);
  }

  tryPush(_: E) {
    return false;
  }

  trySwap() {
    return false;
  }

  swap() {
    throw new Error(`Calling swap on ${this.constructor.name}`);
  }

  clone(): EmptyStack<E> {
    return this;
  }
}
