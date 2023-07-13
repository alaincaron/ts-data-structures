import { Collection } from './collection';
import { OverflowException } from './exceptions';
import { Predicate } from './types';

export abstract class AbstractCollection<E> implements Collection<E> {
  abstract size(): number;

  isEmpty(): boolean {
    return this.size() === 0;
  }

  abstract capacity(): number;

  isFull(): boolean {
    return this.size() >= this.capacity();
  }

  remaining(): number {
    return this.capacity() - this.size();
  }

  contains(item: E): boolean {
    for (const e of this) {
      if (e === item) return true;
    }
    return false;
  }

  toArray(): E[] {
    const result = [];
    for (const e of this) {
      result.push(e);
    }
    return result;
  }

  abstract add(item: E): boolean;
  abstract removeMatchingItem(predicate: Predicate<E>): E | undefined;

  removeItem(item: E): boolean {
    return this.removeMatchingItem(x => x === item) != null;
  }

  abstract filter(predicate: Predicate<E>): boolean;

  find(predicate: Predicate<E>): E | undefined {
    for (const e of this) {
      if (predicate(e)) return e;
    }
    return undefined;
  }

  all(predicate: Predicate<E>) {
    for (const e of this) {
      if (!predicate(e)) return false;
    }
    return true;
  }

  some(predicate: Predicate<E>) {
    for (const e of this) {
      if (predicate(e)) return true;
    }
    return false;
  }

  addMany<E1 extends E>(items: E1[] | Collection<E1>): number {
    const itemsToAdd = Array.isArray(items) ? items.length : items.size();
    if (this.remaining() < itemsToAdd) throw new OverflowException();
    return this.addAll(items);
  }

  addAll<E1 extends E>(iter: Iterable<E1>): number {
    let count = 0;
    for (const e of iter) {
      if (this.add(e)) ++count;
    }
    return count;
  }

  abstract clear(): void;

  abstract [Symbol.iterator](): Iterator<E>;
  abstract iterator(): IterableIterator<E>;

  abstract clone(): Collection<E>;
}
