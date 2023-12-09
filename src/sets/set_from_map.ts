import { Predicate } from 'ts-fluent-iterators';
import { AbstractSet } from './abstract_set';
import { NavigableSet } from './navigable_set';
import { SortedSet } from './sorted_set';
import { buildCollection, CollectionInitializer } from '../collections';
import {
  AvlTreeMap,
  HashMap,
  HashMapOptions,
  IMap,
  LinkedHashMap,
  LinkedHashMapOptions,
  OpenHashMap,
  SortedMap,
  SortedMapOptions,
  SplayTreeMap,
} from '../maps';
import { NavigableMap } from '../maps/navigable_map';

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

export class SortedSetFromMap<E> extends SetFromMap<E> implements SortedSet<E> {
  constructor(delegate: SortedMap<E, boolean>) {
    super(delegate);
  }

  protected delegate() {
    return super.delegate() as SortedMap<E, boolean>;
  }

  first() {
    return this.delegate().firstKey();
  }

  last() {
    return this.delegate().lastKey();
  }
}

export class NavigableSetFromMap<E> extends SortedSetFromMap<E> implements NavigableSet<E> {
  constructor(delegate: NavigableMap<E, boolean>) {
    super(delegate);
  }

  protected delegate() {
    return super.delegate() as NavigableMap<E, boolean>;
  }

  floor(e: E) {
    return this.delegate().floorKey(e);
  }

  ceiling(e: E) {
    return this.delegate().ceilingKey(e);
  }

  lower(e: E) {
    return this.delegate().lowerKey(e);
  }

  higher(e: E) {
    return this.delegate().higherKey(e);
  }

  pollFirst() {
    return this.delegate().pollFirstEntry()?.key;
  }

  pollLast() {
    return this.delegate().pollLastEntry()?.key;
  }

  reverseIterator() {
    return this.delegate().reverseKeyIterator();
  }
}

export class AvlTreeSet<E> extends NavigableSetFromMap<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new AvlTreeMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & CollectionInitializer<E>)): AvlTreeSet<E> {
    return buildCollection<E, AvlTreeSet<E>>(AvlTreeSet, initializer);
  }

  clone(): AvlTreeSet<E> {
    return AvlTreeSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}

export class SplayTreeSet<E> extends NavigableSetFromMap<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new SplayTreeMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & CollectionInitializer<E>)): SplayTreeSet<E> {
    return buildCollection<E, SplayTreeSet<E>>(SplayTreeSet, initializer);
  }

  clone(): SplayTreeSet<E> {
    return SplayTreeSet.create({ initial: { length: this.delegate().size(), seed: this.delegate().keys() } });
  }
}
