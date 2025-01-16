import { FluentIterator } from 'ts-fluent-iterators';
import { SingletonCollection } from './singletonCollection';
import { isMultiSet, MultiSetEntry, SortedMultiSet } from '../multisets';
import { equalsAny } from '../utils';

export class SingletonMultiSet<E> extends SingletonCollection<E> implements SortedMultiSet<E> {
  constructor(item: E) {
    super(item);
  }

  reverseIterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  clone(): SingletonMultiSet<E> {
    return this;
  }

  toReadOnly(): SingletonMultiSet<E> {
    return this;
  }

  asReadOnly(): SingletonMultiSet<E> {
    return this;
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return isMultiSet(other) && other.size() === 1 && other.contains(this.item);
  }

  count(item: E) {
    return equalsAny(item, this.item) ? 1 : 0;
  }

  *entries(): IterableIterator<MultiSetEntry<E>> {
    yield this.firstEntry();
  }

  entryIterator(): FluentIterator<MultiSetEntry<E>> {
    return new FluentIterator(this.entries());
  }

  keyIterator(): FluentIterator<E> {
    return FluentIterator.singleton(this.item);
  }

  *keys() {
    yield this.item;
  }

  nbKeys(): number {
    return 1;
  }

  first() {
    return this.item;
  }

  last() {
    return this.item;
  }

  firstEntry(): MultiSetEntry<E> {
    return { key: this.item, count: 1 };
  }

  lastEntry(): MultiSetEntry<E> {
    return this.firstEntry();
  }

  reverseEntryIterator(): FluentIterator<MultiSetEntry<E>> {
    return this.entryIterator();
  }
}
