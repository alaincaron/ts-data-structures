import { BoundedMap, buildMap } from './abstract_map';
import { HashMapOptions } from './hash_map';
import { MapEntry } from './map';
import { MapInitializer } from './types';
import { MAX_ARRAY_SIZE, hashNumber, HashFunction, nextPrime, hashAny, OverflowException } from '../utils';
import { Predicate, FluentIterator } from 'ts-fluent-iterators';

const DEFAULT_INITIAL_SIZE = 17; // should be prime.
const DEFAULT_LOAD_FACTOR = 0.7;
const DELETED = 'DELETED';

interface HashEntry<K, V> extends MapEntry<K, V> {
  hash: number;
}

type Entry<K, V> = HashEntry<K, V> | 'DELETED' | undefined;

function findIndexForInsertion<K, V>(key: K, h: number, entries: Entry<K, V>[]): number {
  let idx = h;
  let firstDeleted = -1;
  const probe = 1 + (hashNumber(h) % (entries.length - 2));

  for (let i = 0; i < entries.length; ++i) {
    idx = (idx + probe) % entries.length;
    const e: Entry<K, V> = entries[idx];
    if (!e) {
      return firstDeleted < 0 ? idx : firstDeleted;
    }
    if (e === DELETED) {
      if (firstDeleted < 0) {
        firstDeleted = idx;
      }
      continue;
    }
    if (e.hash === h && e.key === key) return idx;
  }
  return firstDeleted;
}

export class OpenHashMap<K, V> extends BoundedMap<K, V> {
  private _size: number;
  public readonly hash: HashFunction<K>;
  public readonly loadFactor: number;
  private slots: Array<Entry<K, V>>;
  private _occupancy: number;

  constructor(options?: number | HashMapOptions<K>) {
    super(options);
    this._size = this._occupancy = 0;
    this.hash = hashAny as (k: K) => number;
    this.loadFactor = DEFAULT_LOAD_FACTOR;

    if (typeof options === 'number') {
      this.slots = new Array(nextPrime(Math.max(options, DEFAULT_INITIAL_SIZE)));
    } else if (!options) {
      this.slots = new Array(DEFAULT_INITIAL_SIZE);
    } else {
      this.slots = new Array(DEFAULT_INITIAL_SIZE);
      if (options.loadFactor != null) {
        if (options.loadFactor <= 0.0) throw new Error(`Invalid load factor: ${options.loadFactor}`);
        this.loadFactor = options.loadFactor;
      }
      if (options.hash) this.hash = options.hash;
    }
  }

  static create<K, V>(initializer?: number | HashMapOptions<K> | MapInitializer<K, V>): OpenHashMap<K, V> {
    return buildMap<K, V, OpenHashMap<K, V>, HashMapOptions<K>>(OpenHashMap, initializer);
  }

  size(): number {
    return this._size;
  }

  clear() {
    const tmp: Entry<K, V>[] = this.slots;
    for (let i = 0; i < tmp.length; ++i) {
      tmp[i] = undefined;
    }
    this._size = this._occupancy = 0;
  }

  filterEntries(predicate: Predicate<[K, V]>) {
    let count = 0;
    for (let i = 0; i < this.slots.length; ++i) {
      const e = this.slots[i];
      if (!e || e === DELETED || predicate([e.key, e.value])) continue;
      this.slots[i] = DELETED;
      --this._size;
      ++count;
    }
    return count;
  }

  protected *entryGenerator(): IterableIterator<MapEntry<K, V>> {
    for (const e of this.slots) {
      if (!e || e === DELETED) continue;
      yield e;
    }
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  clone(): OpenHashMap<K, V> {
    return OpenHashMap.create({ initial: this });
  }

  buildOptions(): HashMapOptions<K> {
    return {
      ...super.buildOptions(),
      hash: this.hash,
      loadFactor: this.loadFactor,
    };
  }

  private findIndex(key: K): number {
    const h = this.hash(key);
    let idx = h;
    const probe = 1 + (hashNumber(h) % (this.slots.length - 2));

    for (let i = 0; i < this.slots.length; ++i) {
      idx = (idx + probe) % this.slots.length;
      const e: Entry<K, V> = this.slots[idx];
      if (!e) break;
      if (e === DELETED) continue;
      if (e.hash === h && e.key === key) return idx;
    }
    return -1;
  }

  containsKey(key: K) {
    return this.findIndex(key) >= 0;
  }

  getEntry(key: K) {
    const idx = this.findIndex(key);
    return idx >= 0 ? (this.slots[idx] as MapEntry<K, V>) : undefined;
  }

  get(key: K) {
    return this.getEntry(key)?.value;
  }

  put(key: K, value: V) {
    const h = this.hash(key);
    let idx = findIndexForInsertion(key, h, this.slots);
    if (idx < 0) {
      // this should not really happen since we perform a rehash if necessary
      // after insertion.
      // But better err on the safe of safety.
      this.rehashIfNecessary();
      idx = findIndexForInsertion(key, h, this.slots);
    }

    const e = this.slots[idx];
    if (!e || e === DELETED) {
      if (this.isFull()) {
        if (this.overflowHandler(key, value)) return undefined;
        if (this.isFull()) throw new OverflowException();
      }
      if (!e) ++this._occupancy;
      ++this._size;
      this.slots[idx] = { key, value, hash: h };
      this.rehashIfNecessary();
      return undefined;
    }
    const old_value = e.value;
    e.value = value;
    return old_value;
  }

  rehashIfNecessary() {
    const threshold = this.slots.length * this.loadFactor;
    if (this._occupancy < threshold) {
      return;
    }

    const nbRemoved = this._occupancy - this._size;
    this._occupancy = this._size;
    if ((this._size >= threshold || nbRemoved > this._size / 2) && this.slots.length < MAX_ARRAY_SIZE) {
      const newCap = this.slots.length * 2;
      if (newCap < 0 || newCap > MAX_ARRAY_SIZE) {
        throw new Error(`Array is too big`);
      }
      this.resize(newCap);
    } else {
      this.rehash();
    }
  }

  resize(newCap: number) {
    newCap = nextPrime(newCap);

    const tmp: Entry<K, V>[] = new Array(newCap);

    for (const e of this.slots) {
      if (!e || e === DELETED) {
        continue;
      }

      const idx = findIndexForInsertion(e.key, e.hash, tmp);
      tmp[idx] = e;
    }
    this.slots = tmp;
  }

  rehash() {
    const tmp: HashEntry<K, V>[] = new Array(this._size);
    let j = 0;
    for (let i = 0; i < this.slots.length; ++i) {
      const e = this.slots[i];
      if (e && e != DELETED) {
        tmp[j++] = e;
      }
      this.slots[i] = undefined;
    }
    for (const e of tmp) {
      const idx = findIndexForInsertion(e.key, e.hash, this.slots);
      this.slots[idx] = e;
    }
  }

  private removeEntry(key: K): HashEntry<K, V> | undefined {
    const idx = this.findIndex(key);
    if (idx < 0) {
      return undefined;
    }

    const entry: HashEntry<K, V> = this.slots[idx] as HashEntry<K, V>;
    this.slots[idx] = DELETED;
    --this._size;
    return entry;
  }

  remove(key: K) {
    return this.removeEntry(key)?.value;
  }
}
