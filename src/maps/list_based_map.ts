import { Comparator, Comparators, Predicate } from 'ts-fluent-iterators';
import { IMap, MapInitializer } from './map';
import { MapEntry } from './map_interface';
import { buildCollection } from '../collections';
import { ArrayList, LinkedList, List } from '../lists';
import { Constructor, equalsAny, WithCapacity } from '../utils';

export abstract class ListBasedMap<K, V> extends IMap<K, V> {
  protected constructor(private readonly _delegate: List<MapEntry<K, V>>) {
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

  clear(): ListBasedMap<K, V> {
    this._delegate.clear();
    return this;
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

  sort(comparator: Comparator<K> = Comparators.natural) {
    this._delegate.sort((e1, e2) => comparator(e1.key, e2.key));
  }

  protected static createMap<
    K,
    V,
    L extends List<MapEntry<K, V>>,
    M extends ListBasedMap<K, V>,
    Options extends object = object,
    Initializer extends MapInitializer<K, V> = MapInitializer<K, V>,
  >(
    mapFactory: Constructor<M, [L]>,
    listFactory: (options?: WithCapacity<Options>) => L,
    initializer?: WithCapacity<Options & Initializer>
  ): M {
    const initialElements = initializer?.initial;

    const options = { ...initializer };
    delete options.initial;
    const delegate = listFactory(options as WithCapacity<Options>);

    const result = new mapFactory(delegate);
    if (initialElements) result.putAll(initialElements);
    return result;
  }

  protected cloneDelegate<L extends List<MapEntry<K, V>>>(factory: Constructor<L>): L {
    const delegate = buildCollection<MapEntry<K, V>, L>(factory, { initial: this.delegate() });
    return delegate.transform(e => ({ ...e })) as L;
  }
}

export class ArrayMap<K, V> extends ListBasedMap<K, V> {
  constructor(delegate?: ArrayList<MapEntry<K, V>>) {
    super(delegate ?? new ArrayList<MapEntry<K, V>>());
  }

  static create<K, V>(initializer?: WithCapacity<MapInitializer<K, V>>): ArrayMap<K, V> {
    return ListBasedMap.createMap<K, V, ArrayList<MapEntry<K, V>>, ArrayMap<K, V>>(
      ArrayMap,
      ArrayList.create,
      initializer
    );
  }

  clone(): ArrayMap<K, V> {
    return new ArrayMap(this.cloneDelegate<ArrayList<MapEntry<K, V>>>(ArrayList));
  }
}

export class LinkedMap<K, V> extends ListBasedMap<K, V> {
  constructor(delegate?: LinkedList<MapEntry<K, V>>) {
    super(delegate ?? new LinkedList<MapEntry<K, V>>());
  }

  static create<K, V>(initializer?: WithCapacity<MapInitializer<K, V>>): LinkedMap<K, V> {
    return ListBasedMap.createMap<K, V, LinkedList<MapEntry<K, V>>, LinkedMap<K, V>>(
      LinkedMap,
      LinkedList.create,
      initializer
    );
  }

  clone(): LinkedMap<K, V> {
    return new LinkedMap(this.cloneDelegate<LinkedList<MapEntry<K, V>>>(LinkedList));
  }
}
