import { Predicate, OverflowException } from '../utils';
import { AbstractMap } from './abstract_map';

export class EmptyMap<K, V> extends AbstractMap<K, V> {
  private static MAP = new EmptyMap();

  public static instance<K, V>() {
    return EmptyMap.MAP as EmptyMap<K, V>;
  }

  protected constructor() {
    super();
  }

  size() {
    return 0;
  }

  capacity() {
    return 0;
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

  *entries() {}
}
