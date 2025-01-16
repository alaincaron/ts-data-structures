import { FluentIterator } from 'ts-fluent-iterators';
import { isMultiMap, NavigableMultiMap } from '../multimaps';
import { hashIterableUnordered } from '../utils';

export class EmptyMultiMap<K, V> implements NavigableMultiMap<K, V> {
  private static EMPTY_MULTIMAP = new EmptyMultiMap<never, never>();

  public static instance<K, V>(): NavigableMultiMap<K, V> {
    return EmptyMultiMap.EMPTY_MULTIMAP;
  }

  protected constructor() {}

  lowerKey(_: K) {
    return undefined;
  }

  higherKey(_: K) {
    return undefined;
  }
  floorKey(_: K): K | undefined {
    return undefined;
  }
  ceilingKey(_: K) {
    return undefined;
  }

  clone() {
    return this;
  }

  reverseKeyIterator() {
    return FluentIterator.empty();
  }
  reverseValueIterator() {
    return FluentIterator.empty();
  }

  containsKey(_: K) {
    return false;
  }
  containsValue(_: V) {
    return false;
  }
  *keys() {}

  *values() {}
  keyIterator() {
    return FluentIterator.empty();
  }

  valueIterator() {
    return FluentIterator.empty();
  }

  entryIterator() {
    return FluentIterator.empty();
  }

  *entries() {}

  ceilingEntry(_: K) {
    return undefined;
  }

  containsEntry(_k: K, _bv: V) {
    return false;
  }

  firstEntry() {
    return undefined;
  }

  floorEntry(_: K) {
    return undefined;
  }

  getValues(_: K) {
    return undefined;
  }

  higherEntry(_: K) {
    return undefined;
  }

  lastEntry() {
    return undefined;
  }

  lowerEntry(_: K) {
    return undefined;
  }

  partitionIterator() {
    return FluentIterator.empty();
  }

  *partitions() {}

  reverseEntryIterator() {
    return FluentIterator.empty();
  }

  toJSON(): string {
    return '{}';
  }

  hashCode(): number {
    return hashIterableUnordered(this);
  }

  equals(other: unknown): boolean {
    if (other === this) return true;
    return isMultiMap<K, V>(other) && other.isEmpty();
  }

  *[Symbol.iterator]() {}

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
