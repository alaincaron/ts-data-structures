import { FluentIterator } from 'ts-fluent-iterators';
import { ImmutableCollection } from './immutableCollection';
import { MultiSet } from '../multisets';

export class ImmutableMultiSet<E> extends ImmutableCollection<E> implements MultiSet<E> {
  constructor(delegate: MultiSet<E>) {
    super(delegate);
  }

  protected get delegate() {
    return super.delegate as MultiSet<E>;
  }

  count(item: E) {
    return this.delegate.count(item);
  }

  entries() {
    return this.delegate.entries();
  }

  clone() {
    return this;
  }

  entryIterator(): FluentIterator<[E, number]> {
    return this.delegate.entryIterator();
  }

  keyIterator(): FluentIterator<E> {
    return this.delegate.keyIterator();
  }

  keys(): IterableIterator<E> {
    return this.delegate.keys();
  }

  nbKeys(): number {
    return this.delegate.nbKeys();
  }
}
