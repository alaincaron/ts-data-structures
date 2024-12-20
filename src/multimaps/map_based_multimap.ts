import { Predicate, SumCollector } from 'ts-fluent-iterators';
import { AbstractMultiMap } from './abstract_multimap';
import { Collection } from '../collections';
import { ArrayList } from '../lists';
import { buildMap, IMap } from '../maps';
import { buildOptions, Constructor, OverflowException } from '../utils';

export type WithCollectionFactory<Type, V> = Type & { collectionFactory?: Constructor<Collection<V>> };

export abstract class MapBasedMultiMap<K, V> extends AbstractMultiMap<K, V> {
  private readonly collectionFactory: Constructor<Collection<V>>;

  protected constructor(
    protected readonly map: IMap<K, Collection<V>>,
    collectionFactory?: Constructor<Collection<V>>
  ) {
    super();
    this.collectionFactory = collectionFactory ?? (ArrayList as unknown as Constructor<Collection<V>>);
  }

  capacity(): number {
    return Infinity;
  }

  size() {
    return this.map
      .valueIterator()
      .map(c => c.size())
      .collectTo(new SumCollector());
  }

  getValues(k: K): Collection<V> | undefined {
    return this.map.get(k);
  }

  removeEntry(key: K, value: V): boolean {
    const values = this.getValues(key);
    if (values?.removeItem(value)) {
      if (values.isEmpty()) this.map.remove(key);
      return true;
    }
    return false;
  }

  removeKey(key: K): Collection<V> | undefined {
    return this.map.remove(key);
  }

  put(key: K, value: V): boolean {
    let values = this.getValues(key);

    if (!values) {
      values = new this.collectionFactory()!;
      this.map.put(key, values);
    }

    if (!this.isFull()) {
      const result = values.add(value);
      if (values.isEmpty()) this.map.remove(key);
      return result;
    }

    if (values.isEmpty()) this.map.remove(key);
    if (values.clone().add(value)) {
      throw new OverflowException();
    }
    return false;
  }

  clear() {
    this.map.clear();
    return this;
  }

  filterKeys(predicate: Predicate<K>): number {
    const initial_size = this.size();
    const nbRemovedKeys = this.map.filterKeys(predicate);
    if (!nbRemovedKeys) return 0;
    return initial_size - this.size();
  }

  filterEntries(predicate: Predicate<[K, V]>): number {
    const nbRemoved = this.map
      .entryIterator()
      .map(e => e.value.filter(v => predicate([e.key, v])))
      .collectTo(new SumCollector());
    if (nbRemoved) {
      this.map.filterEntries(([_, c]) => !c.isEmpty());
    }
    return nbRemoved;
  }

  partitions(): IterableIterator<[K, Collection<V>]> {
    return this.map.entries();
  }

  toJSON() {
    return this.map.toJSON();
  }

  buildOptions() {
    return {
      ...super.buildOptions(),
      collectionFactory: this.collectionFactory,
      delegate: { ...buildOptions(this.map), factory: this.map.constructor as Constructor<IMap<K, Collection<V>>> },
    };
  }

  abstract clone(): MapBasedMultiMap<K, V>;

  protected cloneDelegate<M extends IMap<K, Collection<V>>>(factory: Constructor<M>): M {
    return buildMap<K, Collection<V>, M>(factory, { initial: this.map });
  }
}
