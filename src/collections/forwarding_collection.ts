import { IteratorLike, Mapper, Predicate, Reducer } from 'ts-fluent-iterators';
import { Collection } from './collection';
import { CollectionLike } from './types';

export class ForwardingCollection<E> extends Collection<E> {
  private readonly _delegate: Collection<E>;

  constructor(delegate: Collection<E>) {
    super();
    this._delegate = delegate;
  }

  protected delegate() {
    return this._delegate;
  }

  size() {
    return this._delegate.size();
  }

  capacity() {
    return this._delegate.capacity();
  }

  isEmpty() {
    return this._delegate.isEmpty();
  }

  isFull() {
    return this._delegate.isFull();
  }

  remaining() {
    return this._delegate.remaining();
  }

  contains(item: E) {
    return this._delegate.contains(item);
  }

  toArray() {
    return this._delegate.toArray();
  }

  add(item: E) {
    return this._delegate.add(item);
  }

  offer(item: E) {
    return this._delegate.offer(item);
  }

  removeMatchingItem(predicate: Predicate<E>) {
    return this._delegate.removeMatchingItem(predicate);
  }

  removeItem(item: E) {
    return this._delegate.removeItem(item);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  find(predicate: Predicate<E>) {
    return this._delegate.find(predicate);
  }

  all(predicate: Predicate<E>) {
    return this._delegate.all(predicate);
  }

  some(predicate: Predicate<E>) {
    return this._delegate.some(predicate);
  }

  forEach(f: Mapper<E, any>) {
    this._delegate.forEach(f);
  }

  fold<B>(reducer: Reducer<E, B>, initialValue: B) {
    return this._delegate.fold(reducer, initialValue);
  }

  reduce(reducer: Reducer<E, E>, initialValue?: E) {
    return this._delegate.reduce(reducer, initialValue);
  }

  addFully<E1 extends E>(items: CollectionLike<E1>) {
    return this._delegate.addFully(items);
  }

  addPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>) {
    return this._delegate.addPartially(items);
  }

  offerFully<E1 extends E>(items: CollectionLike<E1>): number {
    return this._delegate.offerFully(items);
  }

  offerPartially<E1 extends E>(items: IteratorLike<E1> | CollectionLike<E1>): number {
    return this._delegate.offerPartially(items);
  }

  clear() {
    return this._delegate.clear();
  }

  containsAll<E1 extends E>(c: Iterable<E1>): boolean {
    return this._delegate.containsAll(c);
  }

  removeAll(c: Collection<E>): number {
    return this._delegate.removeAll(c);
  }

  retainAll(c: Collection<E>): number {
    return this._delegate.retainAll(c);
  }

  [Symbol.iterator]() {
    return this._delegate[Symbol.iterator]();
  }

  iterator() {
    return this._delegate.iterator();
  }

  hashCode() {
    return this._delegate.hashCode();
  }

  equals(other: unknown) {
    return this._delegate.equals(other);
  }

  clone(): ForwardingCollection<E> {
    return new ForwardingCollection<E>(this._delegate.clone());
  }

  buildOptions() {
    return this._delegate.buildOptions();
  }

  toJson() {
    return this._delegate.toJson();
  }
}
