import { MutableMapEntry, Objects } from '../../src';

export function narrow<K, V>(e: MutableMapEntry<K, V> | undefined) {
  return e && Objects.pick(e, 'key', 'value');
}
