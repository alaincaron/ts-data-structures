import { AbstractQueue } from './abstract_queue';

export interface CircularBufferLike<T> {
  capacity: number;
  f: (i: number) => T;
}

export class CircularBuffer<T = any> extends AbstractQueue<T, CircularBuffer<T>> {
  private buffer: Array<T>;
  private readIdx: number;
  private writeIdx: number;

  constructor(args: number | Array<T> | CircularBuffer<T> | CircularBufferLike<T>) {
    super();
    if (typeof args === 'number') {
      const capacity = args as number;
      if (Number.isNaN(capacity) || capacity < 0) {
        throw new Error(`Invalid capacity: ${capacity}`);
      }
      this.buffer = new Array(capacity);
      this.readIdx = this.writeIdx = 0;
    } else if (Array.isArray(args)) {
      const buf = args as Array<T>;
      this.buffer = [...buf];
      this.readIdx = 0;
      this.writeIdx = this.buffer.length;
    } else if (args instanceof CircularBuffer) {
      const original = args as CircularBuffer<T>;
      this.buffer = [...original.buffer];
      this.readIdx = original.readIdx;
      this.writeIdx = original.writeIdx;
    } else {
      const { capacity, f } = args as CircularBufferLike<T>;
      this.buffer = Array.from({ length: capacity }, (_, i: number) => f(i));
      this.readIdx = 0;
      this.writeIdx = this.buffer.length;
    }
  }

  size() {
    const size = this.writeIdx - this.readIdx;
    return size < 0 ? size + this.buffer.length : size;
  }

  capacity() {
    return this.buffer.length;
  }

  isFull() {
    return this.buffer.length == this.size();
  }

  isEmpty() {
    return this.readIdx === this.writeIdx;
  }

  reset(): CircularBuffer<T> {
    this.readIdx = this.writeIdx = 0;
    const capacity = this.buffer.length;
    this.buffer = new Array(capacity);
    return this;
  }

  offer(item: T): boolean {
    if (this.isFull()) return false;
    const capacity = this.buffer.length;
    let idx = this.writeIdx;
    if (idx >= capacity) idx -= capacity;
    this.buffer[idx] = item;
    this.writeIdx++;
    return true;
  }

  poll(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.extract();
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.buffer[this.readIdx];
  }

  clone(): CircularBuffer<T> {
    return new CircularBuffer(this);
  }

  private extract() {
    const item = this.buffer[this.readIdx];
    delete this.buffer[this.readIdx];
    const capacity = this.buffer.length;
    if (++this.readIdx >= capacity) {
      this.readIdx -= capacity;
      this.writeIdx -= capacity;
    }
    return item;
  }
}
