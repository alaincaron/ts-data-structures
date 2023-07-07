import { AbstractQueue } from './abstract_queue';

export interface ArrayLike<T> {
  length: number;
  f: (i: number) => T;
}

export interface StackOptions<T> {
  capacity?: number;
  initial?: Array<T> | Stack<T> | ArrayLike<T>;
}

export class Stack<T = any> extends AbstractQueue<T, Stack<T>> {
  private buffer: Array<T>;
  private index: number;
  private readonly _capacity: number;

  constructor({ capacity, initial }: StackOptions<T> = {}) {
    super();

    this._capacity = capacity ?? Number.MAX_SAFE_INTEGER;
    if (this._capacity < 0) throw new Error(`Invalid negative capacity: ${capacity}`);
    if (!initial) {
      this.buffer = [];
      this.index = 0;
    } else if (Array.isArray(initial)) {
      const buf = initial as Array<T>;
      this.buffer = [...buf];
      this.index = this.buffer.length;
    } else if (initial instanceof Stack) {
      const original = initial as Stack<T>;
      this.buffer = [...original.buffer];
      this.index = original.index;
    } else {
      const { length, f } = initial as ArrayLike<T>;
      this.buffer = Array.from({ length }, (_, i: number) => f(i));
      this.index = this.buffer.length;
    }
    if (this._capacity < this.buffer.length) this._capacity = this.buffer.length;
  }

  size() {
    return this.index;
  }

  capacity() {
    return this._capacity;
  }

  reset(): Stack<T> {
    this.index = 0;
    this.buffer = [];
    return this;
  }

  offer(item: T): boolean {
    if (this.isFull()) return false;
    this.buffer[this.index++] = item;
    return true;
  }

  poll(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.buffer[--this.index];
    this.buffer[this.index] = undefined as unknown as T;
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.buffer[this.index - 1];
  }

  clone(): Stack<T> {
    return new Stack({ capacity: this._capacity, initial: this });
  }
}
