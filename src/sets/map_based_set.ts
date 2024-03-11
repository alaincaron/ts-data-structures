import { Predicate } from 'ts-fluent-iterators';
import { ISet } from './set';
import { CollectionInitializer } from '../collections';
import { buildMap, IMap } from '../maps';
import { Constructor, ContainerOptions } from '../utils';

export abstract class MapBasedSet<E> extends ISet<E> {
  constructor(private readonly _delegate: IMap<E, boolean>) {
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

  clear() {
    this._delegate.clear();
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
    return this._delegate.buildOptions();
  }

  protected static createSet<
    E,
    M extends IMap<E, boolean>,
    S extends MapBasedSet<E>,
    Options extends ContainerOptions = ContainerOptions,
    Initializer extends CollectionInitializer<E> = CollectionInitializer<E>,
  >(setFactory: Constructor<S>, mapFactory: (options?: Options) => M, initializer?: Options & Initializer): S {
    let delegate: M;
    let initialElements;

    if (!initializer?.initial) {
      delegate = mapFactory(initializer as Options);
      initialElements = undefined;
    } else {
      initialElements = initializer.initial;
      let options: any = {
        ...initializer,
      };

      if ('buildOptions' in initialElements && typeof initialElements.buildOptions === 'function') {
        options = { ...options, ...initialElements.buildOptions() };
      }
      delete options.initial;

      delegate = mapFactory(options);
    }
    const result = new setFactory(delegate);
    if (initialElements) result.addFully(initialElements);
    return result;
  }

  protected cloneDelegate<M extends IMap<E, boolean>>(factory: Constructor<M>): M {
    return buildMap<E, boolean, M>(factory, { initial: this.delegate() });
  }
}
