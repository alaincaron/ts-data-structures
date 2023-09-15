import { OverflowException } from '../utils';
import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { AbstractMap } from './abstract_map';

export class EmptyMap<K, V> extends AbstractMap<K, V> {
  private static MAP = new EmptyMap();

  public static instance<K, V>() {
    return EmptyMap.MAP as EmptyMap<K, V>;
  }

  constructor() {
    super({ capacity: 0 });
  }

  size() {
    return 0;
  }

  getEntry(_: K) {
    return undefined;
  }

  containsValue(_: V) {
    return false;
  }

  put(_key: K, _value: V): never {
    throw new OverflowException(`Calling put on ${this.constructor.name}`);
  }

  remove(_: K) {
    return undefined;
  }

  clear() {}

  clone(): EmptyMap<K, V> {
    return this;
  }

  filterEntries(_: Predicate<[K, V]>) {}

  entryIterator() {
    return FluentIterator.empty();
  }
}
