import { AbstractMap } from './abstract_map';
import { IMap } from './map';
import { nextPrime, cyrb53, Predicate } from '../utils';

interface HashEntry<K, V> {
  key: K;
  value: V;
  next: HashEntry<K, V> | undefined;
  readonly hash: number;
}

export interface MapOptions<K, V> {
  capacity?: number;
  initial?: Map<K, V> | IMap<K, V>;
}

export interface HashMapOptions<K, V> extends MapOptions<K, V> {
  hash?: (k: K) => number;
  equal?: (k1: K, k2: K) => boolean;
}

export class HashMap<K, V> extends AbstractMap<K, V> {
  private _size: number;
  private _capacity: number;
  private slots: Array<HashEntry<K, V> | undefined>;
  private readonly hash: (k: K) => number;
  private readonly equal: (k1: K, k2: K) => boolean;

  constructor(initializer?: number | HashMap<K, V> | HashMapOptions<K, V>) {
    super();
    this._size = 0;
    this._capacity = Infinity;
    this.hash = cyrb53 as (k: K) => number;
    this.equal = (k1, k2) => k1 === k2;

    if (initializer == null) {
      this.slots = new Array(3);
    } else if (typeof initializer === 'number') {
      this.slots = new Array(nextPrime(initializer));
    } else if (initializer instanceof HashMap) {
      throw new Error('Not implemented');
    } else {
      throw new Error('Not implemented');
    }
  }

  size(): number {
    return this._size;
  }

  capacity(): number {
    return this._capacity;
  }

  private getSlot(h: number): number {
    h = h % this.slots.length;
    if (h < 0) h += this.slots.length;
    return h;
  }

  private getEntry(key: K): HashEntry<K, V> | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h);
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equal(e.key, key))) e = e.next;
    return e;
  }

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

  put(key: K, value: V): V | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equal(e.key, key))) {
      prev = e;
      e = e.next;
    }
    if (!e) {
      e = { key, value, next: undefined, hash: h };
      ++this._size;
      if (prev) {
        prev.next = e;
      } else {
        this.slots[slot] = e;
      }
      return undefined;
    } else {
      const old = e.value;
      e.value = value;
      return old;
    }
  }

  containsKey(key: K): boolean {
    return !!this.getEntry(key);
  }

  remove(key: K): V | undefined {
    const h = this.hash(key);
    const slot = this.getSlot(h);
    let prev: HashEntry<K, V> | undefined = undefined;
    let e = this.slots[slot];
    while (e && !(e.hash === h && this.equal(e.key, key))) {
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
