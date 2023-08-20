import { AbstractCollection } from './abstract_collection';
import { OverflowException, Predicate } from '../utils';

export class EmptyCollection<E> extends AbstractCollection<E> {
  private static COL = new EmptyCollection();

  public static instance<T>() {
    return EmptyCollection.COL as EmptyCollection<T>;
  }

  protected constructor() {
    super({ capacity: 0 });
  }

  size(): number {
    return 0;
  }

  add(_item: E): void {
    throw new OverflowException(`Adding to ${this.constructor.name}`);
  }

  offer(_item: E): boolean {
    return false;
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
