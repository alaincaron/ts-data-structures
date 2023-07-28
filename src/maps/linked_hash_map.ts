import { HashMap, HashEntry, HashMapBuildOptions } from './hash_map';
import { MapEntry } from './map';
import { MapInitializer } from './types';
interface LinkedHashEntry<K, V> extends HashEntry<K, V> {
  before: LinkedHashEntry<K, V>;
  after: LinkedHashEntry<K, V>;
}

export interface LinkedHashMapBuildOptions<K, V> extends HashMapBuildOptions<K, V> {
  accessOrder?: boolean;
}

export type LinkedHashMapInitOptions<K, V> = Omit<LinkedHashMapBuildOptions<K, V>, 'nbSlots'> & {
  initial?: MapInitializer<K, V>;
};

export class LinkedHashMap<K, V> extends HashMap<K, V> {
  private accessOrder: boolean;
  private header: LinkedHashEntry<K, V>;

  constructor(initializer?: number | LinkedHashMapBuildOptions<K, V>) {
    super(initializer);
    this.accessOrder = typeof initializer === 'object' ? !!initializer.accessOrder : false;
    this.header = {} as LinkedHashEntry<K, V>;
    this.header.before = this.header.after = this.header;
  }

  static from<K, V>(options: LinkedHashMapInitOptions<K, V>): LinkedHashMap<K, V> {
    const m = new LinkedHashMap(HashMap.convertHashMapInitOptions(options) as LinkedHashMapBuildOptions<K, V>);
    if (options.initial) for (const [k, v] of options.initial) m.put(k, v);
    return m;
  }

  protected recordInsertion(e: HashEntry<K, V>) {
    const ee = e as LinkedHashEntry<K, V>;
    this.addBefore(ee, this.header);
  }

  private removeEntryFromLinkedList(e: LinkedHashEntry<K, V>) {
    e.before.after = e.after;
    e.after.before = e.before;
  }

  private addBefore(e: LinkedHashEntry<K, V>, existingEntry: LinkedHashEntry<K, V>) {
    e.after = existingEntry;
    e.before = existingEntry.before;
    e.before.after = e;
    e.after.before = e;
  }

  protected recordAccess(e: MapEntry<K, V>): void {
    if (this.accessOrder) {
      const ee = e as LinkedHashEntry<K, V>;
      this.removeEntryFromLinkedList(ee);
      this.addBefore(ee, this.header);
    }
  }

  protected recordRemoval(e: MapEntry<K, V>): void {
    this.removeEntryFromLinkedList(e as LinkedHashEntry<K, V>);
  }

  clear() {
    super.clear();
    this.header.before = this.header.after = this.header;
  }

  *entries(): IterableIterator<MapEntry<K, V>> {
    for (let e = this.header.after; e != this.header; e = e.after) yield e;
  }

  clone(): LinkedHashMap<K, V> {
    const m = new LinkedHashMap<K, V>({
      capacity: this.capacity(),
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
