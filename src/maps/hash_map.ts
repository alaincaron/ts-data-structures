import { AbstractMap } from './abstract_map';
import { MapOptions, MapComparators } from './types';
import { nextPrime, cyrb53, Predicate, LARGEST_PRIME, OverflowException } from '../utils';

interface HashEntry<K, V> {
  key: K;
  value: V;
  next: HashEntry<K, V> | undefined;
  readonly hash: number;
}

export interface HashMapOptions<K, V> extends MapOptions<K, V> {
  hash?: (k: K) => number;
  loadFactor?: number;
}

const MIN_INITIAL_CAPACITY = nextPrime(5);
const DEFAULT_LOAD_FACTOR = 0.75;

export class HashMap<K, V> extends AbstractMap<K, V> {
  private _size: number;
  private _capacity: number;
  private slots: Array<HashEntry<K, V> | undefined>;
  private readonly hash: (k: K) => number;
  private readonly loadFactor: number;

  private static toOptions<K, V>(initializer: any): MapComparators<K, V> | undefined {
    if (initializer?.equalK || initializer?.equalV) return initializer;
    return undefined;
  }

  constructor(initializer?: number | HashMap<K, V> | HashMapOptions<K, V>) {
    super(HashMap.toOptions(initializer));

    this._size = 0;
    this.hash = cyrb53 as (k: K) => number;
    this.loadFactor = DEFAULT_LOAD_FACTOR;

    if (initializer == null) {
      this.slots = new Array(MIN_INITIAL_CAPACITY);
      this._capacity = Infinity;
    } else if (typeof initializer === 'number') {
      this.slots = new Array(nextPrime(Math.max(initializer, MIN_INITIAL_CAPACITY)));
      this._capacity = initializer;
    } else if (initializer instanceof HashMap) {
      this.loadFactor = initializer.loadFactor;
      this._size = initializer._size;
      this._capacity = initializer._capacity;
      this.hash = initializer.hash;
      this.slots = new Array(initializer.slots.length);
      this.putAll(initializer);
    } else {
      if (initializer.loadFactor != null) {
        if (initializer.loadFactor <= 0.0) throw new Error(`Invalid load factor: ${initializer.loadFactor}`);
        this.loadFactor = initializer.loadFactor;
      }
      const capacity = initializer.capacity ?? Infinity;
      const initialElements = initializer.initial;
      if (!initialElements) {
        this.slots = new Array(MIN_INITIAL_CAPACITY);
        this._capacity = capacity;
      } else {
        const s = initialElements.size;
        const size = typeof s === 'function' ? s.call(initialElements) : s;
        this._capacity = Math.max(capacity, size);
        this.slots = new Array(nextPrime(Math.max(size / this.loadFactor, MIN_INITIAL_CAPACITY)));
        for (const [k, v] of initialElements.entries()) {
          this.put(k, v);
        }
      }
    }
  }

  size(): number {
    return this._size;
  }

  capacity(): number {
    return this._capacity;
  }

  private getSlot(h: number, slots: Array<HashEntry<K, V> | undefined>): number {
    h = h % slots.length;
    if (h < 0) h += slots.length;
    return h;
  }

  private getEntry(key: K): HashEntry<K, V> | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h, this.slots);
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equalK(e.key, key))) e = e.next;
    return e;
  }

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

  put(key: K, value: V): V | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h, this.slots);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equalK(e.key, key))) {
      prev = e;
      e = e.next;
    }
    if (!e) {
      if (this.isFull()) throw new OverflowException();
      e = { key, value, next: undefined, hash: h };
      ++this._size;
      if (prev) {
        prev.next = e;
      } else {
        this.slots[slot] = e;
      }
      if (this.slots.length * this.loadFactor < this._size) this.rehash();
      return undefined;
    } else {
      const old = e.value;
      e.value = value;
      return old;
    }
  }

  private rehash() {
    let newLength = this.slots.length * 1.5;
    if (newLength < 0 || newLength >= LARGEST_PRIME) {
      newLength = LARGEST_PRIME;
    } else {
      newLength = nextPrime(newLength);
    }
    const newSlots = new Array(newLength);
    for (let i = 0; i < this.slots.length; ++i) {
      let e = this.slots[i];
      while (e) {
        const next = e.next;
        const slot = this.getSlot(e.hash, newSlots);
        e.next = newSlots[slot];
        newSlots[slot] = e;
        e = next;
      }
    }
    this.slots = newSlots;
  }

  containsKey(key: K): boolean {
    return !!this.getEntry(key);
  }

  remove(key: K): V | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h, this.slots);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equalK(e.key, key))) {
      prev = e;
      e = e.next;
    }
    if (!e) return undefined;
    if (prev) {
      prev.next = e.next;
    } else {
      this.slots[slot] = e.next;
    }
    --this._size;
    return e.value;
  }

  filterEntries(predicate: Predicate<[K, V]>): void {
    for (let i = 0; i < this.slots.length; ++i) {
      let prev: HashEntry<K, V> | undefined = undefined;
      let e = this.slots[i];
      while (e) {
        if (!predicate([e.key, e.value])) {
          if (prev) {
            prev.next = e.next;
          } else {
            this.slots[i] = e.next;
          }
          --this._size;
        } else {
          prev = e;
        }
        e = e.next;
      }
    }
  }

  clear() {
    for (let i = 0; i < this.slots.length; ++i) this.slots[i] = undefined;
    this._size = 0;
  }

  *entries(): IterableIterator<[K, V]> {
    for (let i = 0; i < this.slots.length; ++i) {
      let e = this.slots[i];
      while (e) {
        yield [e.key, e.value];
        e = e.next;
      }
    }
  }

  clone(): HashMap<K, V> {
    return new HashMap(this);
  }
}
