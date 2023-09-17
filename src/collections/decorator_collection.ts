import { Collection } from './collection';
import { Predicate } from 'ts-fluent-iterators';
import { ContainerOptions } from '../utils';
import { AbstractCollection } from './abstract_collection';

export class DecoratorCollection<E = any> extends AbstractCollection<E> {
  private readonly _delegate: Collection<E>;

  constructor(delegate: Collection<E>) {
    super();
    this._delegate = delegate;
  }

  protected delegate(): Collection<E> {
    return this._delegate;
  }

  size(): number {
    return this._delegate.size();
  }

  capacity(): number {
    return this._delegate.capacity();
  }

  offer(item: E): boolean {
    return this._delegate.offer(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this._delegate.removeMatchingItem(predicate);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  clear(): void {
    this._delegate.clear();
  }

  [Symbol.iterator](): Iterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  buildOptions(): ContainerOptions {
    return this._delegate.buildOptions?.() ?? {};
  }

  clone(): DecoratorCollection<E> {
    throw new Error();
  }
}
