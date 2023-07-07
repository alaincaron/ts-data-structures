import { OverflowException, UnderflowException } from './exceptions';

export abstract class AbstractQueue<T, Q extends AbstractQueue<T, Q>> implements Iterable<T> {
  // insertion
  abstract offer(item: T): boolean;

  add(item: T): Q {
    if (!this.offer(item)) throw new OverflowException();
    return this as unknown as Q;
  }

  push(item: T) {
    this.add(item);
  }

  addMany<Q1 extends AbstractQueue<T, Q1>>(items: T[] | Q1): Q {
    const itemsToAdd = Array.isArray(items) ? items.length : items.size();
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    for (const item of items) this.add(item);
    return this as unknown as Q;
  }

  offerFully<Q1 extends AbstractQueue<T, Q1>>(items: T[] | Q1): number {
    const itemsToAdd = Array.isArray(items) ? items.length : items.size();
    if (this.remaining() < itemsToAdd) return 0;
    for (const item of items) this.add(item);
    return itemsToAdd;
  }

  offerPartially<Q1 extends AbstractQueue<T, Q1>>(items: T[] | Q1): number {
    let count = 0;
    for (const item of items) {
      if (!this.offer(item)) break;
      ++count;
    }
    return count;
  }

  // removal
  abstract poll(): T | undefined;
  remove(): T {
    if (this.isEmpty()) throw new UnderflowException();
    return this.poll()!;
  }
  pop(): T {
    return this.remove();
  }

  // inspection
  abstract peek(): T | undefined;

  element(): T {
    if (this.isEmpty()) throw new UnderflowException();
    return this.peek()!;
  }

  // others
  abstract size(): number;
  abstract capacity(): number;

  isEmpty(): boolean {
    return this.size() === 0;
  }

  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  remaining(): number {
    return this.capacity() - this.size();
  }

  abstract reset(): Q;

  abstract clone(): Q;

  toArray(): Array<T> {
    return Array.from({ length: this.size() }, (_v, _i) => this.remove());
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => {
        if (this.isEmpty()) {
          return {
            done: true,
            value: undefined,
          };
        }
        return {
          done: false,
          value: this.remove(),
        };
      },
    };
  }
}
