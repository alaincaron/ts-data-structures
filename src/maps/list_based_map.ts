import { Predicate } from 'ts-fluent-iterators';
import { buildMap, IMap, MapEntry, MapInitializer } from './map';
import { ArrayList, List } from '../lists';
import { ContainerOptions, equalsAny } from '../utils';

export class ListBasedMap<K, V> extends IMap<K, V> {
  constructor(private readonly _delegate: List<MapEntry<K, V>>) {
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

  protected getEntry(key: K) {
    return this._delegate.find(e => equalsAny(e.key, key));
  }

  put(key: K, value: V) {
    const e = this.getEntry(key);
    if (!e) {
      this._delegate.add({ key, value });
      return undefined;
    }
    const oldValue = e.value;
    e.value = value;
    return oldValue;
  }

  remove(key: K) {
    return this._delegate.removeFirstMatchingItem(e => equalsAny(e.key, key))?.value;
  }

  filterEntries(predicate: Predicate<[K, V]>) {
    return this._delegate.filter(e => predicate([e.key, e.value]));
  }

  entryIterator() {
    return this._delegate.iterator();
  }

  buildOptions() {
    return this._delegate.buildOptions();
  }

  clone() {
    return new ListBasedMap(this._delegate.clone());
  }
}

export class ArrayMap<K, V> extends ListBasedMap<K, V> {
  constructor(options?: number | ContainerOptions) {
    super(new ArrayList<MapEntry<K, V>>(options));
  }

  static create<K, V>(initializer?: number | (ContainerOptions & MapInitializer<K, V>)): ArrayMap<K, V> {
    return buildMap<K, V, ArrayMap<K, V>>(ArrayMap, initializer);
  }

  clone(): ArrayMap<K, V> {
    return ArrayMap.create({ initial: this });
  }
}
