import { CapacityMixin, ContainerOptions } from '../utils';
import { Predicate } from 'ts-fluent-iterators';
import { AbstractCollection, ForwardingCollection, Collection, buildCollection } from '../collections';
import { ISet } from './set';
import { ArrayList } from '../lists';
import { IMap, HashMap, HashMapOptions, LinkedHashMap, LinkedHashMapOptions } from '../maps';

export abstract class AbstractSet<E = any> extends AbstractCollection<E> implements ISet<E> {
  constructor(options?: number | ContainerOptions) {
    super(options);
  }

  toSet() {
    return this.iterator().collectToSet();
  }

  add(item: E) {
    if (this.contains(item)) return false;
    return super.add(item);
  }

  abstract clone(): AbstractSet<E>;
}

export const BoundedSet = CapacityMixin(AbstractSet);

export class SetFromCollection<E = any> extends ForwardingCollection<E> implements ISet<E> {
  constructor(delegate: Collection<E>) {
    super(delegate);
  }

  toSet() {
    return this.iterator().collectToSet();
  }

  add(item: E) {
    if (this.contains(item)) return false;
    return super.add(item);
  }

  clone(): SetFromCollection<E> {
    return new SetFromCollection(this.delegate().clone());
  }
}

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
}

export class ArraySet<E = any> extends SetFromCollection<E> {
  constructor(options?: number | ContainerOptions) {
    super(new ArrayList<E>(options));
  }

  clone(): ArraySet<E> {
    return buildCollection<E, ArraySet<E>>(options => new ArraySet(options), { initial: this.delegate() });
  }
}

export class HashSet<E = any> extends SetFromMap<E> {
  constructor(options?: number | HashMapOptions<E>) {
    super(new HashMap<E>(options));
  }

  clone(): HashSet<E> {
    return buildCollection<E, HashSet<E>, HashMapOptions<E>>(options => new HashSet(options), {
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
    });
  }
}

export class LinkedHashSet<E = any> extends SetFromMap<E> {
  constructor(options?: number | LinkedHashMapOptions<E>) {
    super(new LinkedHashMap<E>(options));
  }

  clone(): LinkedHashSet<E> {
    return buildCollection<E, LinkedHashSet<E>, LinkedHashMapOptions<E>>(options => new LinkedHashSet(options), {
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
    });
  }
}
