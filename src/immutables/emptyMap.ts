import { FluentIterator } from 'ts-fluent-iterators';
import { isMap, MapEntry, NavigableMap } from '../maps';
import { hashIterableUnordered } from '../utils';

class EmptyMap<K, V> implements NavigableMap<K, V> {
  private static readonly EMPTY_MAP = new EmptyMap<never, never>();

  private constructor() {}

  lowerKey(_: K) {
    return undefined;
  }
  lowerEntry(_: K) {
    return undefined;
  }
  higherKey(_: K) {
    return undefined;
  }
  higherEntry(_: K) {
    return undefined;
  }
  floorEntry(_: K) {
    return undefined;
  }
  floorKey(_: K) {
    return undefined;
  }
  ceilingKey(_: K) {
    return undefined;
  }
  ceilingEntry(_: K) {
    return undefined;
  }
  firstEntry() {
    return undefined;
  }
  lastEntry() {
    return undefined;
  }
  firstKey(): K | undefined {
    return undefined;
  }
  lastKey() {
    return undefined;
  }
  reverseEntryIterator() {
    return FluentIterator.empty();
  }
  reverseKeyIterator() {
    return FluentIterator.empty();
  }
  reverseValueIterator() {
    return FluentIterator.empty();
  }
  *reverseEntries() {}
  *[Symbol.iterator]() {}

  static instance<K, V>(): NavigableMap<K, V> {
    return EmptyMap.EMPTY_MAP;
  }

  getEntry(_k: K) {
    return undefined;
  }

  get(_k: K) {
    return undefined;
  }
  containsKey(_: K): boolean {
    return false;
  }
  containsValue(_: V): boolean {
    return false;
  }
  *keys(): IterableIterator<K> {}
  *values(): IterableIterator<V> {}

  keyIterator(): FluentIterator<K> {
    return FluentIterator.empty();
  }

  valueIterator(): FluentIterator<V> {
    return FluentIterator.empty();
  }
  entryIterator(): FluentIterator<MapEntry<K, V>> {
    return FluentIterator.empty();
  }

  *entries(): IterableIterator<[K, V]> {}

  toMap(): Map<K, V> {
    return new Map<K, V>();
  }

  toJSON(): string {
    return '{}';
  }

  hashCode(): number {
    return hashIterableUnordered(this);
  }

  clone(): NavigableMap<K, V> {
    return this;
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return isMap<K, V>(other) && other.isEmpty();
  }

  size(): number {
    return 0;
  }
  capacity(): number {
    return 0;
  }
  isEmpty(): boolean {
    return true;
  }
  isFull(): boolean {
    return true;
  }

  remaining(): number {
    return 0;
  }
}

export function emptyMap<K, V>() {
  return EmptyMap.instance<K, V>();
}
