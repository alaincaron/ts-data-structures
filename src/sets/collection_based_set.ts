import { Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { CollectionInitializer, CollectionLike, MutableCollection } from '../collections';
import { ArrayList } from '../lists';
import { Constructor, extractOptions, WithCapacity } from '../utils';

export abstract class CollectionBasedSet<E> extends AbstractSet<E> {
  private readonly _delegate: MutableCollection<E>;
  protected constructor(delegate: MutableCollection<E>) {
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

  clear(): CollectionBasedSet<E> {
    this._delegate.clear();
    return this;
  }

  [Symbol.iterator](): Iterator<E> {
    return this._delegate[Symbol.iterator]();
  }

  buildOptions() {
    if ('buildOptions' in this._delegate && typeof this._delegate.buildOptions === 'function') {
      return this._delegate.buildOptions();
    }
    return {};
  }

  add(item: E) {
    const d = this.delegate();
    if (d.contains(item)) return false;
    return d.add(item);
  }

  abstract clone(): CollectionBasedSet<E>;

  protected static createSet<
    E,
    C extends MutableCollection<E>,
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
}

export class ArraySet<E> extends CollectionBasedSet<E> {
  constructor(delegate?: ArrayList<E>) {
    super(delegate ?? new ArrayList<E>());
  }

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): ArraySet<E> {
    return CollectionBasedSet.createSet<E, ArrayList<E>, ArraySet<E>>(ArraySet, ArrayList.create, initializer);
  }

  clone(): ArraySet<E> {
    return new ArraySet<E>(this.delegate().clone() as ArrayList<E>);
  }
}
