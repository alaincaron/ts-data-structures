import { EqualFunction, Predicate, equalPredicate } from '../utils';
import { IMap, MapEntry } from './map';
import { MapOptions, MapInitializer } from './types';

export abstract class AbstractMap<K, V> implements IMap<K, V> {
  public readonly equalK: EqualFunction<K>;
  public readonly equalV: EqualFunction<V>;
  private readonly _capacity: number;

  constructor(options?: number | MapOptions<K, V>) {
    let capacity;
    let equalK;
    let equalV;

    if (typeof options === 'number') {
      capacity = options;
    } else {
      capacity = options?.capacity;
      equalK = options?.equalK;
      equalV = options?.equalV;
    }

    this._capacity = capacity ?? Infinity;
    this.equalK = equalK ?? equalPredicate;
    this.equalV = equalV ?? equalPredicate;
  }

  abstract size(): number;

  capacity() {
    return this._capacity;
  }

  isEmpty() {
    return this.size() === 0;
  }

  isFull() {
    return this.size() >= this.capacity();
  }

  remaining() {
    return this.capacity() - this.size();
  }

  abstract getEntry(key: K): MapEntry<K, V> | undefined;

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

  abstract put(key: K, value: V): V | undefined;

  containsKey(key: K) {
    return this.getEntry(key) !== undefined;
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (this.equalV(value, v)) return true;
    }
    return false;
  }

  abstract remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): void {
    this.filterEntries(([k, _]) => predicate(k));
  }

  filterValues(predicate: Predicate<V>): void {
    this.filterEntries(([_, v]) => predicate(v));
  }

  abstract filterEntries(predicate: Predicate<[K, V]>): void;

  putAll<K1 extends K, V1 extends V>(map: IMap<K1, V1>) {
    for (const { key, value } of map.entries()) {
      this.put(key, value);
    }
  }

  abstract clear(): void;

  *keys(): IterableIterator<K> {
    for (const e of this.entries()) yield e.key;
  }

  *values(): IterableIterator<V> {
    for (const e of this.entries()) yield e.value;
  }

  abstract entries(): IterableIterator<MapEntry<K, V>>;

  abstract clone(): IMap<K, V>;

  [Symbol.iterator](): Iterator<[K, V]> {
    const iter = this.entries();
    return {
      next: () => {
        const item = iter.next();
        if (item.done) {
          return { done: true, value: undefined };
        }
        return { done: false, value: [item.value.key, item.value.value] };
      },
    };
  }

  buildOptions(): MapOptions<K, V> {
    return {
      capacity: this._capacity,
      equalK: this.equalK,
      equalV: this.equalV,
    };
  }

  static buildMap<
    K,
    V,
    Initializer extends MapInitializer<K, V>,
    M extends IMap<K, V>,
    Options extends MapOptions<K, V>
  >(factory: (options: Options) => M, initializer: Initializer): M {
    const initialElements = initializer.initial;
    const options =
      initialElements instanceof AbstractMap
        ? { ...initialElements.buildOptions(), ...initializer }
        : { ...initializer };
    const result = factory(options as unknown as Options);

    if (initialElements) {
      for (const [k, v] of initialElements) {
        result.put(k, v);
      }
    }
    return result;
  }
}
