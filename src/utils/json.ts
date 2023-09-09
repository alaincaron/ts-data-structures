import { toIterator } from './iterators';
import { IteratorLike, ArrayLike } from './types';

export function toJSON(x: any) {
  if (typeof x.toJson === 'function') return x.toJson();
  if (x instanceof Map) {
    return mapToJSON(x);
  }
  if (x instanceof Set) {
    return iterableToJSON(x);
  }
  return JSON.stringify(x);
}

export function mapToJSON<K = any, V = any>(entries: Map<K, V> | ArrayLike<[K, V]> | IteratorLike<[K, V]>) {
  const iterator = entries instanceof Map ? entries[Symbol.iterator]() : toIterator(entries);
  let s = '{';

  for (;;) {
    const item = iterator.next();
    if (item.done) break;
    const [k, v] = item.value;
    if (s.length > 1) s += ',';
    s += toJSON(k);
    s += ':';
    s += toJSON(v);
  }
  s += '}';
  return s;
}

export function iterableToJSON<E = any>(items: ArrayLike<E> | IteratorLike<E>) {
  const iterator = toIterator(items);
  let s = '[';
  for (;;) {
    const item = iterator.next();
    if (item.done) break;
    if (s.length > 1) s += ',';
    s += toJSON(item.value);
  }
  s += ']';
  return s;
}
