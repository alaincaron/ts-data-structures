import { FluentIterator } from 'ts-fluent-iterators';
import { SingletonCollection } from './singletonCollection';
import { isMultiSet, SortedMultiSet } from '../multisets';
import { equalsAny } from '../utils';

export class SingletonMultiSet<E> extends SingletonCollection<E> implements SortedMultiSet<E> {
  constructor(item: E) {
    super(item);
  }

  reverseIterator() {
    return FluentIterator.singleton(this.item);
  }

  equals(other: unknown) {
    if (other === this) return true;
    return isMultiSet(other) && other.size() === 1 && other.contains(this.item);
  }

  count(item: E) {
    return equalsAny(item, this.item) ? 1 : 0;
  }

  *entries() {
    yield this.firstEntry();
  }

  entryIterator() {
    return new FluentIterator(this.entries());
  }

  keyIterator() {
    return FluentIterator.singleton(this.item);
  }

  *keys() {
    yield this.item;
  }

  nbKeys() {
    return 1;
  }

  first() {
    return this.item;
  }

  last() {
    return this.item;
  }

  firstEntry() {
    return { key: this.item, count: 1 };
  }

  lastEntry() {
    return this.firstEntry();
  }

  reverseEntryIterator() {
    return this.entryIterator();
  }
}
