import { HashMultiMap } from '../../src';

export function createMultiMap<K, V>(...values: [K, V][]) {
  return HashMultiMap.create({ initial: values });
}
