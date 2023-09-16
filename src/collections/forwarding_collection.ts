import { Collection } from './collection';
import { Predicate, Reducer } from 'ts-fluent-iterators';
import { CollectionLike } from './types';

export abstract class ForwardingCollection<E = any> implements Collection<E> {
  private readonly _delegate: Collection<E>;

  constructor(delegate: Collection<E>) {
    this._delegate = delegate;
  }

  protected delegate(): Collection<E> {
    return this._delegate;
  }

  size(): number {
    return this._delegate.size();
  }

  isEmpty(): boolean {
    return this._delegate.isEmpty();
  }

  capacity(): number {
    return this._delegate.capacity();
  }

  isFull(): boolean {
    return this._delegate.isFull();
  }

  remaining(): number {
    return this._delegate.remaining();
  }
  contains(item: E): boolean {
    return this._delegate.contains(item);
  }

  toArray(): E[] {
    return this._delegate.toArray();
  }

  offer(item: E): boolean {
    return this._delegate.offer(item);
  }

  add(item: E): boolean {
    return this._delegate.add(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this._delegate.removeMatchingItem(predicate);
  }

  removeItem(item: E): boolean {
    return this._delegate.removeItem(item);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  find(predicate: Predicate<E>): E | undefined {
    return this._delegate.find(predicate);
  }

  all(predicate: Predicate<E>): boolean {
    return this._delegate.all(predicate);
  }

  some(predicate: Predicate<E>): boolean {
    return this._delegate.some(predicate);
  }

  addFully<E1 extends E>(items: CollectionLike<E1>): number {
    return this._delegate.addFully(items);
  }

  addPartially<E1 extends E>(iter: Iterable<E1>): number {
    return this._delegate.addPartially(iter);
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    return this._delegate.offerFully(items);
  }

  offerPartially<E1 extends E>(items: Iterable<E1>): number {
    return this._delegate.offerPartially(items);
  }

  clear(): void {
    this._delegate.clear();
  }

  forEach(f: (item: E) => any): void {
    this._delegate.forEach(f);
  }

  fold<B>(reducer: Reducer<E, B>, initialValue: B): B {
    return this._delegate.fold(reducer, initialValue);
  }

  reduce(reducer: Reducer<E, E>, initialValue?: E): E | undefined {
    return this._delegate.reduce(reducer, initialValue);
  }

  iterator() {
    return this._delegate.iterator();
  }

  [Symbol.iterator](): Iterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  toJson() {
    return this._delegate.toJson();
  }

  abstract clone(): ForwardingCollection<E>;
}
