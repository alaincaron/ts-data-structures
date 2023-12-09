import { Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { buildCollection, CollectionInitializer } from '../collections';
import {
  AvlTreeMap,
  HashMap,
  HashMapOptions,
  IMap,
  LinkedHashMap,
  LinkedHashMapOptions,
  OpenHashMap,
  SortedMapOptions,
  SplayTreeMap,
} from '../maps';

export class SetFromMap<E> extends AbstractSet<E> {
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

export class HashSet<E> extends SetFromMap<E> {
  constructor(options?: number | HashMapOptions) {
    super(new HashMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): HashSet<E> {
    return buildCollection<E, HashSet<E>>(HashSet, initializer);
  }

  clone(): HashSet<E> {
    return HashSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class LinkedHashSet<E> extends SetFromMap<E> {
  constructor(options?: number | LinkedHashMapOptions) {
    super(new LinkedHashMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (LinkedHashMapOptions & CollectionInitializer<E>)): LinkedHashSet<E> {
    return buildCollection<E, LinkedHashSet<E>>(LinkedHashSet, initializer);
  }

  clone(): LinkedHashSet<E> {
    return LinkedHashSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class OpenHashSet<E> extends SetFromMap<E> {
  constructor(options?: number | HashMapOptions) {
    super(new OpenHashMap<E, boolean>(options));
  }
  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): OpenHashSet<E> {
    return buildCollection<E, OpenHashSet<E>>(OpenHashSet, initializer);
  }

  clone(): OpenHashSet<E> {
    return OpenHashSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class AvlTreeSet<E> extends SetFromMap<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new AvlTreeMap<E, boolean>(options));
  }
  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): AvlTreeSet<E> {
    return buildCollection<E, AvlTreeSet<E>>(OpenHashSet, initializer);
  }

  clone(): AvlTreeSet<E> {
    return AvlTreeSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class SplayTreeSet<E> extends SetFromMap<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new SplayTreeMap<E, boolean>(options));
  }
  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): SplayTreeSet<E> {
    return buildCollection<E, SplayTreeSet<E>>(OpenHashSet, initializer);
  }

  clone(): SplayTreeSet<E> {
    return SplayTreeSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}
