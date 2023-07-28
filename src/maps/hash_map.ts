import { AbstractMap } from './abstract_map';
import { MapOptions, MapComparators, MapInitializer } from './types';
import { MapEntry } from './map';
import { nextPrime, hashAny, Predicate, LARGEST_PRIME, OverflowException } from '../utils';

export interface HashEntry<K, V> extends MapEntry<K, V> {
  next: HashEntry<K, V> | undefined;
  readonly hash: number;
}

export interface HashMapBuildOptions<K, V> extends MapOptions<K, V> {
  nbSlots?: number;
  hash?: (k: K) => number;
  loadFactor?: number;
}

export type HashMapInitOptions<K, V> = Omit<HashMapBuildOptions<K, V>, 'nbSlots'> & {
  initial?: MapInitializer<K, V>;
};

const MIN_INITIAL_CAPACITY = nextPrime(5);
const DEFAULT_LOAD_FACTOR = 0.75;

export class HashMap<K, V> extends AbstractMap<K, V> {
  private _size: number;
  private _capacity: number;
  protected slots: Array<HashEntry<K, V> | undefined>;
  protected readonly hash: (k: K) => number;
  protected readonly loadFactor: number;

  private static toOptions<K, V>(initializer: any): MapComparators<K, V> | undefined {
    if (initializer?.equalK || initializer?.equalV) return initializer;
    return undefined;
  }

  constructor(initializer?: number | HashMapBuildOptions<K, V>) {
    super(HashMap.toOptions(initializer));

    this._size = 0;
    this.hash = hashAny as (k: K) => number;
    this.loadFactor = DEFAULT_LOAD_FACTOR;

    if (initializer == null) {
      this.slots = new Array(MIN_INITIAL_CAPACITY);
      this._capacity = Infinity;
    } else if (typeof initializer === 'number') {
      this.slots = new Array(nextPrime(Math.max(initializer, MIN_INITIAL_CAPACITY)));
      this._capacity = initializer;
    } else {
      this._capacity = initializer.capacity ?? Infinity;
      if (initializer.loadFactor != null) {
        if (initializer.loadFactor <= 0.0) throw new Error(`Invalid load factor: ${initializer.loadFactor}`);
        this.loadFactor = initializer.loadFactor;
      }
      if (initializer.hash) this.hash = initializer.hash;
      let nbSlots = initializer.nbSlots ?? MIN_INITIAL_CAPACITY;
      if (nbSlots < MIN_INITIAL_CAPACITY) nbSlots = MIN_INITIAL_CAPACITY;
      else if (nbSlots > MIN_INITIAL_CAPACITY) nbSlots = nextPrime(nbSlots);
      this.slots = new Array(nbSlots);
    }
  }

  protected static convertHashMapInitOptions<K, V>(options: HashMapInitOptions<K, V>): HashMapBuildOptions<K, V> {
    let nbSlots: number | undefined = undefined;
    const loadFactor = options.loadFactor ?? DEFAULT_LOAD_FACTOR;
    const elements = options.initial;
    const size = (elements as any)?.size;
    if (typeof size === 'number') {
      nbSlots = size;
    } else if (typeof size === 'function') {
      nbSlots = size.call(elements);
    }
    if (nbSlots) nbSlots /= loadFactor;
    return { ...options, nbSlots };
  }

  static from<K, V>(options: HashMapInitOptions<K, V>): HashMap<K, V> {
    const m = new HashMap(HashMap.convertHashMapInitOptions(options));
    if (options.initial) for (const [k, v] of options.initial) m.put(k, v);
    return m;
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

  public getEntry(key: K): MapEntry<K, V> | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h, this.slots);
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equalK(e.key, key))) e = e.next;
    if (e) this.recordAccess(e);
    return e;
  }

  protected handleOverflow() {
    throw new OverflowException();
  }

  protected recordInsertion(_e: MapEntry<K, V>): void {}
  protected recordAccess(_e: MapEntry<K, V>): void {}
  protected recordRemoval(_e: MapEntry<K, V>): void {}

  put(key: K, value: V): V | undefined {
    const hash = this.hash(key);
    const slot = this.getSlot(hash, this.slots);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && !(e.hash === hash && this.equalK(e.key, key))) {
      prev = e;
      e = e.next;
    }
    if (!e) {
      if (this.isFull()) {
        this.handleOverflow();
        if (this.isFull()) throw new OverflowException();
      }

      e = { key, value, next: undefined, hash };
      this.recordInsertion(e);
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
      this.recordAccess(e);
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

  private removeEntry(key: K): HashEntry<K, V> | undefined {
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
    this.recordRemoval(e);

    return e;
  }

  remove(key: K): V | undefined {
    return this.removeEntry(key)?.value;
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
          this.recordRemoval(e);
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

  *entries(): IterableIterator<MapEntry<K, V>> {
    for (let i = 0; i < this.slots.length; ++i) {
      let e = this.slots[i];
      while (e) {
        yield e;
        e = e.next;
      }
    }
  }

  clone(): HashMap<K, V> {
    const m = new HashMap<K, V>({
      capacity: this._capacity,
      equalK: this.equalK,
      equalV: this.equalV,
      nbSlots: this.slots.length,
      hash: this.hash,
      loadFactor: this.loadFactor,
    });
    m.putAll(this);
    return m;
  }
}
