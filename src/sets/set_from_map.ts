import { IMap, HashMap, HashMapOptions, LinkedHashMap, LinkedHashMapOptions } from '../maps';
import { AbstractSet } from './abstract_set';
import { Predicate } from 'ts-fluent-iterators';
import { buildCollection, CollectionInitializer } from '../collections';

export class SetFromMap<E = any> extends AbstractSet<E> {
  private readonly _delegate: IMap<E, boolean>;

  constructor(delegate: IMap<E, boolean>) {
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

  [Symbol.iterator](): Iterator<E> {
    return this._delegate.keys();
  }

  clone(): SetFromMap<E> {
    return new SetFromMap(this._delegate.clone());
  }

  buildOptions() {
    return this._delegate.buildOptions?.() ?? {};
  }
}

export class HashSet<E = any> extends SetFromMap<E> {
  constructor(options?: number | HashMapOptions<E>) {
    super(new HashMap<E>(options));
  }

  static create<E>(initializer?: number | (HashMapOptions<E> & CollectionInitializer<E>)): HashSet<E> {
    return buildCollection<E, HashSet<E>>(HashSet, initializer);
  }

  clone(): HashSet<E> {
    return HashSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class LinkedHashSet<E = any> extends SetFromMap<E> {
  constructor(options?: number | LinkedHashMapOptions<E>) {
    super(new LinkedHashMap<E>(options));
  }

  static create<E>(initializer?: number | (LinkedHashMapOptions<E> & CollectionInitializer<E>)): LinkedHashSet<E> {
    return buildCollection<E, LinkedHashSet<E>>(LinkedHashSet, initializer);
  }

  clone(): LinkedHashSet<E> {
    return LinkedHashSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}
