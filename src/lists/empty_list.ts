import { FluentIterator, Iterators } from 'ts-fluent-iterators';
import { IndexOutOfBoundsException } from '../utils';
import { AbstractList } from './abstract_list';
import { ListIterator } from './list';

export class EmptyList<E> extends AbstractList<E> {
  private static LIST = new EmptyList();

  public static instance<T>() {
    return EmptyList.LIST as EmptyList<T>;
  }

  protected constructor() {
    super({ capacity: 0 });
  }

  getAt(_idx: number): never {
    throw new IndexOutOfBoundsException();
  }

  offerAt(idx: number) {
    if (idx != 0) throw new IndexOutOfBoundsException();
    return false;
  }

  setAt(_idx: number, _item: E): never {
    throw new IndexOutOfBoundsException();
  }

  removeAt(_idx: number): never {
    throw new IndexOutOfBoundsException();
  }

  reverseIterator() {
    return FluentIterator.empty();
  }

  listIterator(_start?: number | 'head' | 'tail'): ListIterator<E> {
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        return { done: true, value: undefined };
      },
      setValue: (_item: E) => {
        throw new Error('Invoking setValue on emptyListIterator');
      },
      remove: () => {
        throw new Error('Invoking remove on emptyListIterator');
      },
    };
  }

  reverseListIterator(start?: number | 'head' | 'tail'): ListIterator<E> {
    return this.listIterator(start);
  }

  size() {
    return 0;
  }

  offer(_item: E) {
    return false;
  }

  clear() {}

  iterator() {
    return FluentIterator.empty();
  }

  [Symbol.iterator](): Iterator<E> {
    return Iterators.empty();
  }

  clone(): EmptyList<E> {
    return this;
  }
}
