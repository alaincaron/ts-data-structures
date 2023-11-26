import { Iterators, IteratorGenerator } from 'ts-fluent-iterators';
export function toJSON(x: any) {
  if (x == null) return JSON.stringify(x);
  if (typeof x.toJson === 'function') return x.toJson();
  switch (typeof x) {
    case 'string':
    case 'number':
    case 'boolean':
      return JSON.stringify(x);
    case 'bigint':
      return x.toString();
    case 'symbol':
      return JSON.stringify(x.description);
  }

  if (x instanceof Map) {
    return mapToJSON(x);
  }

  const iter = Iterators.toIteratorMaybe(x);
  if (iter) {
    return iterableToJSON(iter);
  }
  return mapToJSON(Object.entries(x));
}

export function mapToJSON<K = any, V = any>(entries: Map<K, V> | IteratorGenerator<[K, V]>) {
  const iterator = entries instanceof Map ? entries[Symbol.iterator]() : Iterators.toIterator(entries);
  let s = '{';

  for (;;) {
    const item = iterator.next();
    if (item.done) break;
    const [k, v] = item.value;
    const jsonv = toJSON(v);
    if (jsonv === undefined) continue;

    let jsonk = toJSON(k);
    if (jsonk === undefined) jsonk = '"undefined"';
    else if (jsonk === 'null') jsonk == '"null"';

    if (s.length > 1) s += ',';
    s += '';
    s += jsonk;
    s += ':';
    s += jsonv;
  }
  s += '}';
  return s;
}

export function iterableToJSON<E = any>(items: IteratorGenerator<E>) {
  const iterator = Iterators.toIterator(items);
  let s = '[';
  for (;;) {
    const item = iterator.next();
    if (item.done) break;
    if (s.length > 1) s += ',';
    s += toJSON(item.value) ?? null;
  }
  s += ']';
  return s;
}
