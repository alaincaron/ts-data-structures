import { Comparator, Comparators } from 'ts-fluent-iterators';
import { SingletonSet } from './singletonSet';
import { NavigableSet } from '../sets';

export class SingletonNavigableSet<E> extends SingletonSet<E> implements NavigableSet<E> {
  constructor(
    item: E,
    private readonly comparator: Comparator<E> = Comparators.natural
  ) {
    super(item);
  }

  floor(e: E) {
    return this.comparator(e, this.item) >= 0 ? this.item : undefined;
  }

  ceiling(e: E) {
    return this.comparator(e, this.item) <= 0 ? this.item : undefined;
  }

  lower(e: E) {
    return this.comparator(e, this.item) > 0 ? this.item : undefined;
  }

  higher(e: E) {
    return this.comparator(e, this.item) < 0 ? this.item : undefined;
  }
}
