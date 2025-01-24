import { MultiMap } from '../multimaps/multimap';

export abstract class ImmutableMultiMap<K, V> implements MultiMap<K, V> {
  protected constructor(private readonly _delegate: MultiMap<K, V>) {}

  get delegate() {
    return this._delegate;
  }

  [Symbol.iterator]() {
    return this.delegate[Symbol.iterator]();
  }

  capacity(): number {
    return this.delegate.capacity();
  }

  clone() {
    return this;
  }

  containsEntry(key: K, value: V) {
    return this.delegate.containsEntry(key, value);
  }

  containsKey(key: K) {
    return this.delegate.containsKey(key);
  }

  containsValue(value: V) {
    return this.delegate.containsValue(value);
  }

  entries() {
    return this.delegate.entries();
  }

  entryIterator() {
    return this.delegate.entryIterator();
  }

  equals(other: unknown) {
    return this.delegate.equals(other);
  }

  getValues(k: K) {
    return this.delegate.getValues(k);
  }

  hashCode(): number {
    return this.delegate.hashCode();
  }

  isEmpty(): boolean {
    return this.delegate.isEmpty();
  }

  isFull(): boolean {
    return true;
  }

  keyIterator() {
    return this.delegate.keyIterator();
  }

  keys() {
    return this.delegate.keys();
  }

  partitionIterator() {
    return this.delegate.partitionIterator();
  }

  partitions() {
    return this.delegate.partitions();
  }

  remaining() {
    return 0;
  }

  size() {
    return this.delegate.size();
  }

  toJSON() {
    return this.delegate.toJSON();
  }

  valueIterator() {
    return this.delegate.valueIterator();
  }

  values() {
    return this.delegate.values();
  }
}
