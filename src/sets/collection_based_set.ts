import { Constructor, Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { CollectionInitializer, CollectionLike, MutableCollection } from '../collections';
import { ArrayList } from '../lists';
import { ContainerOptions, extractOptions, WithCapacity } from '../utils';

export abstract class CollectionBasedSet<
  E,
  C extends MutableCollection<E>,
  Options extends object = object,
> extends AbstractSet<E> {
  private readonly _delegate: MutableCollection<E>;
  protected constructor(ctor: Constructor<C, [Options | undefined]>, options?: Options) {
    super();
    this._delegate = 'create' in ctor && typeof ctor.create === 'function' ? ctor.create(options) : new ctor(options);
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

  clear(): CollectionBasedSet<E, C, Options> {
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

  abstract clone(): CollectionBasedSet<E, C, Options>;

  protected static createSet<
    E,
    C extends MutableCollection<E>,
    Options extends object,
    S extends CollectionBasedSet<E, C, Options>,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(ctor: Constructor<S>, initializer?: WithCapacity<Options & Initializer>): S {
    const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);
    const result = new ctor(options);
    if (initialElements) result.addFully(initialElements);
    return result;
  }
}

export class ArraySet<E> extends CollectionBasedSet<E, ArrayList<E>, object> {
  constructor(options?: object) {
    super(ArrayList, options);
  }

  static create<E>(initializer?: WithCapacity<CollectionInitializer<E>>): ArraySet<E> {
    return CollectionBasedSet.createSet<E, ArrayList<E>, ContainerOptions, ArraySet<E>>(ArraySet, initializer);
  }

  clone(): ArraySet<E> {
    return CollectionBasedSet.createSet<E, ArrayList<E>, ContainerOptions, ArraySet<E>>(ArraySet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
