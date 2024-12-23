import { Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { CollectionInitializer, CollectionLike } from '../collections';
import { buildMap, MutableMap } from '../maps';
import { buildOptions, Constructor, extractOptions, WithCapacity } from '../utils';

export abstract class MapBasedSet<E> extends AbstractSet<E> {
  protected constructor(private readonly _delegate: MutableMap<E, boolean>) {
    super();
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

  clear(): MapBasedSet<E> {
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

  abstract clone(): MapBasedSet<E>;

  buildOptions() {
    return buildOptions(this._delegate);
  }

  protected static createSet<
    E,
    M extends MutableMap<E, boolean>,
    S extends MapBasedSet<E>,
    Options extends object = object,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(
    setFactory: Constructor<S>,
    mapFactory: (options?: Options) => M,
    initializer?: WithCapacity<Options & Initializer>
  ): S {
    const { options, initialElements } = extractOptions<CollectionLike<E>>(initializer);
    const delegate = mapFactory(options);
    const result = new setFactory(delegate);
    if (initialElements) result.addFully(initialElements);
    return result;
  }

  protected cloneDelegate<M extends MutableMap<E, boolean>>(factory: Constructor<M>): M {
    return buildMap<E, boolean, M>(factory, { initial: this.delegate() });
  }
}
