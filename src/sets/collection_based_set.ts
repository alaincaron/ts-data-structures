import { Predicate } from 'ts-fluent-iterators';
import { ISet } from './set';
import { buildCollection, Collection, CollectionInitializer, CollectionLike } from '../collections';
import { ArrayList } from '../lists';
import { Constructor, extractOptions, WithCapacity } from '../utils';

export abstract class CollectionBasedSet<E> extends ISet<E> {
  private _delegate: Collection<E>;
  constructor(delegate: Collection<E>) {
    super();
    this._delegate = delegate;
  }

  protected delegate() {
    return this._delegate;
  }

  size(): number {
    return this._delegate.size();
  }

  capacity(): number {
    return this._delegate.capacity();
  }

  offer(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return true;
    if (d.isFull()) return false;
    return d.add(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this._delegate.removeMatchingItem(predicate);
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filter(predicate);
  }

  clear() {
    this._delegate.clear();
    return this;
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  buildOptions() {
    return this._delegate.buildOptions();
  }

  add(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return false;
    return d.add(item);
  }

  abstract clone(): CollectionBasedSet<E>;

  protected static createSet<
    E,
    C extends Collection<E>,
    S extends CollectionBasedSet<E>,
    Options extends object = object,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(setFactory: Constructor<S>, colFactory: (options?: Options) => C, initializer?: Options & Initializer): S {
    const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);
    const delegate = colFactory(options);
    const result = new setFactory(delegate);
    if (initialElements) result.addFully(initialElements);
    return result;
  }

  protected cloneDelegate<C extends Collection<E>>(factory: Constructor<C>): C {
    return buildCollection<E, C>(factory, { initial: this.delegate() });
  }
}

export class ArraySet<E> extends CollectionBasedSet<E> {
  constructor(delegate?: ArrayList<E>) {
    super(delegate ?? new ArrayList<E>());
  }

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): ArraySet<E> {
    return CollectionBasedSet.createSet<E, ArrayList<E>, ArraySet<E>>(ArraySet, ArrayList.create, initializer);
  }

  clone(): ArraySet<E> {
    return new ArraySet(this.cloneDelegate<ArrayList<E>>(ArrayList));
  }
}
