import { Constructor, Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { CollectionInitializer, CollectionLike } from '../collections';
import { MutableMap } from '../maps';
import { buildOptions, extractOptions, WithCapacity } from '../utils';

export abstract class MapBasedSet<
  E,
  M extends MutableMap<E, boolean>,
  Options extends object = object,
> extends AbstractSet<E> {
  private readonly _delegate: M;

  protected constructor(ctor: Constructor<M, [Options | undefined]>, options?: Options) {
    super();
    this._delegate = 'create' in ctor && typeof ctor.create === 'function' ? ctor.create(options) : new ctor(options);
  }

  protected delegate(): M {
    return this._delegate;
  }

  size() {
    return this._delegate.size();
  }

  capacity() {
    return this._delegate.capacity();
  }

  clear(): MapBasedSet<E, M, Options> {
    this._delegate.clear();
    return this;
  }

  offer(item: E) {
    return this._delegate.offer(item, true).accepted;
  }

  add(item: E) {
    return !this._delegate.put(item, true);
  }

  contains(item: E) {
    return this._delegate.containsKey(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    for (const k of this._delegate.keys()) {
      if (predicate(k)) {
        this._delegate.remove(k);
        return k;
      }
    }
    return undefined;
  }

  filter(predicate: Predicate<E>) {
    return this._delegate.filterKeys(predicate);
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this._delegate.keys();
  }

  abstract clone(): MapBasedSet<E, M, Options>;

  buildOptions() {
    return buildOptions(this._delegate);
  }

  protected static createSet<
    E,
    M extends MutableMap<E, boolean>,
    Options extends object,
    S extends MapBasedSet<E, M, Options>,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(ctor: Constructor<S, [Options | undefined]>, initializer?: WithCapacity<Options & Initializer>): S {
    const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);
    const result = new ctor(options);
    if (initialElements) result.addFully(initialElements);
    return result;
  }
}
