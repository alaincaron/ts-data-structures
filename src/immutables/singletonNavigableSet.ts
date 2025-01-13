import { Comparator, Comparators } from 'ts-fluent-iterators';
import { SingletonSet } from './singletonSet';
import { NavigableSet } from '../sets';

export class SingletonNavigableSetSet<E> extends SingletonSet<E> implements NavigableSet<E> {
  constructor(
    item: E,
    private readonly comparator: Comparator<E> = Comparators.natural
  ) {
    super(item);
  }

  clone(): SingletonNavigableSetSet<E> {
    return this;
  }

  toReadOnly(): SingletonNavigableSetSet<E> {
    return this;
  }

  asReadOnly(): SingletonNavigableSetSet<E> {
    return this;
  }

  floor(e: E): E | undefined {
    return this.comparator(e, this.item) >= 0 ? this.item : undefined;
  }

  ceiling(e: E): E | undefined {
    return this.comparator(e, this.item) <= 0 ? this.item : undefined;
  }

  lower(e: E): E | undefined {
    return this.comparator(e, this.item) > 0 ? this.item : undefined;
  }

  higher(e: E): E | undefined {
    return this.comparator(e, this.item) < 0 ? this.item : undefined;
  }
}
