import { BoundedMap, buildMap } from './abstract_map';
import { MapInitializer } from './types';
import { MapEntry } from './map';
import { ContainerOptions, nextPrime, hashAny, HashFunction, LARGEST_PRIME, OverflowException } from '../utils';
import { FluentIterator, Predicate } from 'ts-fluent-iterators';

export interface HashEntry<K, V> extends MapEntry<K, V> {
  next: HashEntry<K, V> | undefined;
  readonly hash: number;
}

export enum AccessType {
  GET,
  INSERT,
  MODIFY,
  REMOVE,
}

export interface HashMapOptions<K> extends ContainerOptions {
  hash?: HashFunction<K>;
  loadFactor?: number;
}

const MIN_INITIAL_CAPACITY = nextPrime(5);
const DEFAULT_LOAD_FACTOR = 0.75;

export class HashMap<K = any, V = any> extends BoundedMap<K, V> {
  private _size: number;
  private slots: Array<HashEntry<K, V> | undefined>;
  public readonly hash: HashFunction<K>;
  public readonly loadFactor: number;

  protected recordAccess(_e: HashEntry<K, V>, _accessType: AccessType) {}

  constructor(options?: number | HashMapOptions<K>) {
    super(options);
    this._size = 0;
    this.hash = hashAny as (k: K) => number;
    this.loadFactor = DEFAULT_LOAD_FACTOR;

    if (typeof options === 'number') {
      this.slots = new Array(nextPrime(Math.max(options, MIN_INITIAL_CAPACITY)));
    } else if (options == null) {
      this.slots = new Array(MIN_INITIAL_CAPACITY);
    } else {
      this.slots = new Array(MIN_INITIAL_CAPACITY);
      if (options.loadFactor != null) {
        if (options.loadFactor <= 0.0) throw new Error(`Invalid load factor: ${options.loadFactor}`);
        this.loadFactor = options.loadFactor;
      }
      if (options.hash) this.hash = options.hash;
    }
  }

  static create<K, V>(initializer?: number | HashMapOptions<K> | MapInitializer<K, V>): HashMap<K, V> {
    return buildMap<K, V, HashMap<K, V>, HashMapOptions<K>>(HashMap, initializer);
  }

  size(): number {
    return this._size;
  }

  private getSlot(h: number, slots: Array<HashEntry<K, V> | undefined>): number {
    h = h % slots.length;
    if (h < 0) h += slots.length;
    return h;
  }

  getEntry(key: K): MapEntry<K, V> | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h, this.slots);
    let e = this.slots[slot];
    while (e && (e.hash !== h || e.key !== key)) e = e.next;
    if (e) this.recordAccess(e, AccessType.GET);
    return e;
  }

  put(key: K, value: V): V | undefined {
    const hash = this.hash(key);
    const slot = this.getSlot(hash, this.slots);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && (e.hash !== hash || e.key !== key)) {
      prev = e;
      e = e.next;
    }
    if (!e) {
      if (this.isFull()) {
        if (this.overflowHandler(key, value)) return undefined;
        if (this.isFull()) throw new OverflowException();
      }

      e = { key, value, next: undefined, hash };
      this.recordAccess(e, AccessType.INSERT);
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
      this.recordAccess(e, AccessType.MODIFY);
      return old;
    }
  }

  private rehash() {
    let newLength = this.slots.length * 2;
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
    while (e && (e.hash !== h || e.key !== key)) {
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
    this.recordAccess(e, AccessType.REMOVE);

    return e;
  }

  remove(key: K): V | undefined {
    return this.removeEntry(key)?.value;
  }

  filterEntries(predicate: Predicate<[K, V]>): number {
    let count = 0;
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
          this.recordAccess(e, AccessType.REMOVE);
          --this._size;
          ++count;
        } else {
          prev = e;
        }
        e = e.next;
      }
    }
    return count;
  }

  clear() {
    for (let i = 0; i < this.slots.length; ++i) this.slots[i] = undefined;
    this._size = 0;
  }

  protected *entryGenerator(): IterableIterator<MapEntry<K, V>> {
    for (let i = 0; i < this.slots.length; ++i) {
      let e = this.slots[i];
      while (e) {
        yield e as unknown as MapEntry<K, V>;
        e = e.next;
      }
    }
  }

  entryIterator() {
    return new FluentIterator(this.entryGenerator());
  }

  clone(): HashMap<K, V> {
    return HashMap.create({ initial: this });
  }

  buildOptions(): HashMapOptions<K> {
    return {
      ...super.buildOptions(),
      hash: this.hash,
      loadFactor: this.loadFactor,
    };
  }
}
