import { FluentIterator } from 'ts-fluent-iterators';
import { SingletonList } from './singletonList';
import { Collection } from '../collections';
import { MapEntry } from '../maps';
import { isMultiMap, SortedMultiMap } from '../multimaps';
import { equalsAny, hashAny, toJSON } from '../utils';

export class SingletonMultiMap<K, V> implements SortedMultiMap<K, V> {
  private readonly entry: MapEntry<K, Collection<V>>;

  constructor(key: K, value: V) {
    this.entry = { key, value: new SingletonList(value) };
  }

  firstEntry() {
    return this.entry;
  }

  lastEntry() {
    return this.entry;
  }

  reverseEntryIterator() {
    return FluentIterator.singleton(this.entry);
  }

  reverseKeyIterator() {
    return FluentIterator.singleton(this.getKey());
  }

  reverseValueIterator() {
    return this.entry.value.iterator();
  }

  clone() {
    return this;
  }

  getValues(key: K) {
    return equalsAny(key, this.getKey()) ? this.entry.value : undefined;
  }

  containsKey(key: K) {
    return equalsAny(key, this.getKey());
  }

  containsValue(value: V): boolean {
    return equalsAny(value, this.entry.value.iterator().first());
  }

  containsEntry(key: K, value: V): boolean {
    return this.containsKey(key) && this.containsValue(value);
  }

  *keys() {
    yield this.getKey();
  }

  *values() {
    yield this.getValue();
  }

  *entries(): IterableIterator<[K, V]> {
    yield [this.getKey(), this.getValue()];
  }

  *partitions(): IterableIterator<[K, Collection<V>]> {
    yield [this.getKey(), this.entry.value];
  }

  keyIterator() {
    return FluentIterator.singleton(this.getKey());
  }

  valueIterator() {
    return this.entry.value.iterator();
  }

  partitionIterator(): FluentIterator<[K, Collection<V>]> {
    return FluentIterator.singleton([this.getKey(), this.entry.value]);
  }

  entryIterator(): FluentIterator<[K, V]> {
    return FluentIterator.singleton([this.getKey(), this.getValue()]);
  }

  toJSON(): string {
    return toJSON({ [String(this.getKey())]: [...this.entry.value] });
  }

  hashCode(): number {
    return hashAny(this.entry);
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return (
      isMultiMap<K, V>(other) &&
      other.size() === 1 &&
      other.containsKey(this.getKey()) &&
      other.containsValue(this.getValue())
    );
  }

  size(): number {
    return 1;
  }

  capacity(): number {
    return 1;
  }

  isEmpty(): boolean {
    return false;
  }

  isFull(): boolean {
    return true;
  }

  remaining(): number {
    return 0;
  }

  *[Symbol.iterator](): Iterator<[K, V]> {
    yield [this.getKey(), this.getValue()];
  }

  protected getEntry() {
    return this.entry;
  }
  protected getKey() {
    return this.entry.key;
  }

  protected getValue() {
    return this.entry.value.iterator().first()!;
  }
}
