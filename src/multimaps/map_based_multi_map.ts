import { Collectors, Predicate } from 'ts-fluent-iterators';
import { BoundedMultiMap } from './multi_map';
import { Collection } from '../collections';
import { ArrayList } from '../lists';
import { IMap } from '../maps';
import { ContainerOptions, OverflowException } from '../utils';

const SumCollector = Collectors.SumCollector;

export interface MapBasedMultiMapOptions<V> extends ContainerOptions {
  collectionFactory?: new () => Collection<V>;
}

export abstract class MapBasedMultiMap<K, V> extends BoundedMultiMap<K, V> {
  protected readonly map: IMap<K, Collection<V>>;
  private _size: number;
  private readonly collectionFactory: new () => Collection<V>;

  constructor(
    mapFactory: IMap<K, Collection<V>> | (new () => IMap<K, Collection<V>>),
    options?: number | MapBasedMultiMapOptions<V>
  ) {
    super(options);
    this._size = 0;
    if (typeof mapFactory === 'function') {
      this.map = new mapFactory();
    } else {
      this.map = mapFactory;
    }
    if (typeof options === 'object') {
      this.collectionFactory = options.collectionFactory ?? ArrayList;
    } else {
      this.collectionFactory = ArrayList;
    }
  }

  size() {
    return this._size;
  }

  protected getValues(k: K): Collection<V> | undefined {
    return this.map.get(k);
  }

  removeEntry(key: K, value: V): boolean {
    const values = this.getValues(key);
    if (values?.removeItem(value)) {
      --this._size;
      if (values.isEmpty()) this.map.remove(key);
      return true;
    }
    return false;
  }

  removeKey(key: K): Collection<V> | undefined {
    const e = this.map.remove(key);
    if (e) this._size -= e.size();
    return e;
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
      if (result) ++this._size;
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
    this._size = 0;
  }

  filterKeys(predicate: Predicate<K>): number {
    const initial_size = this.size();
    const nbRemovedKeys = this.map.filterKeys(predicate);
    if (!nbRemovedKeys) return 0;
    this._size = this.map
      .valueIterator()
      .map(c => c.size())
      .collectTo(new SumCollector());
    return initial_size - this._size;
  }

  filterEntries(predicate: Predicate<[K, V]>): number {
    const nbRemoved = this.map
      .entryIterator()
      .map(e => e.value.filter(v => predicate([e.key, v])))
      .collectTo(new SumCollector());
    if (nbRemoved) {
      this.map.filterEntries(([_, c]) => !c.isEmpty());
      this._size -= nbRemoved;
    }
    return nbRemoved;
  }

  protected rawIterator(): IterableIterator<[K, Collection<V>]> {
    return this.map.entries();
  }

  toJson() {
    return this.map.toJson();
  }

  buildOptions(): MapBasedMultiMapOptions<V> {
    return {
      ...super.buildOptions(),
      collectionFactory: this.collectionFactory,
    };
  }

  abstract clone(): MapBasedMultiMap<K, V>;
}
