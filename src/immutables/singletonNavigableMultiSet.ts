import { Comparator, Comparators } from 'ts-fluent-iterators';
import { SingletonMultiSet } from './singletonMultiSet';
import { MultiSetEntry, NavigableMultiSet } from '../multisets';

export class SingletonNavigableMultiSet<E> extends SingletonMultiSet<E> implements NavigableMultiSet<E> {
  constructor(
    item: E,
    private readonly comparator: Comparator<E> = Comparators.natural
  ) {
    super(item);
  }

  lower(item: E) {
    return this.comparator(item, this.item) > 0 ? this.item : undefined;
  }

  lowerEntry(item: E): MultiSetEntry<E> | undefined {
    return this.computeEntry(item, (item: E) => this.lower(item));
  }

  private computeEntry(item: E, f: (item: E) => E | undefined) {
    const e = f(item);
    if (e === undefined) return undefined;
    return { key: e, count: 1 };
  }

  higher(item: E) {
    return this.comparator(item, this.item) < 0 ? this.item : undefined;
  }

  higherEntry(item: E) {
    return this.computeEntry(item, (item: E) => this.higher(item));
  }

  floor(item: E) {
    return this.comparator(item, this.item) >= 0 ? this.item : undefined;
  }

  floorEntry(item: E): MultiSetEntry<E> | undefined {
    return this.computeEntry(item, (item: E) => this.floor(item));
  }

  ceiling(item: E) {
    return this.comparator(item, this.item) <= 0 ? this.item : undefined;
  }

  ceilingEntry(item: E) {
    return this.computeEntry(item, (item: E) => this.ceiling(item));
  }

  clone() {
    return this;
  }
}
