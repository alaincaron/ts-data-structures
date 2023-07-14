import { AbstractCollection } from './abstract_collection';
import { OverflowException } from './exceptions';
import { Predicate } from './types';

export class EmptyCollection<E> extends AbstractCollection<E> {
  private static COL = new EmptyCollection();

  public static instance<T>() {
    return EmptyCollection.COL as EmptyCollection<T>;
  }

  protected constructor() {
    super();
  }

  size(): number {
    return 0;
  }

  capacity(): number {
    return 0;
  }

  add(_item: E): void {
    throw new OverflowException(`Adding to ${this.constructor.name}`);
  }

  removeMatchingItem(_predicate: Predicate<E>) {
    return undefined;
  }

  filter(_predicate: Predicate<E>) {
    return false;
  }

  clear() {}

  clone(): EmptyCollection<E> {
    return this;
  }

  *iterator() {}

  [Symbol.iterator](): Iterator<E> {
    return {
      next: () => {
        return { done: true, value: undefined };
      },
    };
  }
}
