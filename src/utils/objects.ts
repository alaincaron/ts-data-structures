import { Comparator, Comparators, Predicate } from 'ts-fluent-iterators';

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, val) => {
      if (obj[val] !== undefined) acc[val] = obj[val];
      return acc;
    },
    {} as Pick<T, K>
  );
}

export function removeNull<V, T extends Record<string, V>>(obj: T): Partial<T> {
  return filter(obj, ([_, v]) => v != null);
}

export function removeEmpty<V, T extends Record<string, V>>(obj: T): Partial<T> {
  return filter(obj, ([_, v]) => v != null && (typeof v != 'string' || !!v));
}

export function filter<V, T extends Record<string, V>>(obj: T, predicate: Predicate<[string, V]>): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(predicate)) as Partial<T>;
}

export function deepFilter(
  obj: unknown,
  valueFilter: Predicate<[string, unknown]>,
  keyFilter?: Predicate<string>
): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(e => deepFilter(e, valueFilter, keyFilter));
  return Object.fromEntries(
    Object.entries(obj).reduce((acc: any[], [k, v]) => {
      if (keyFilter && !keyFilter(k)) return acc;
      if (v != null && typeof v === 'object') {
        const v1 = deepFilter(v, valueFilter, keyFilter) as object;
        if (Object.keys(v1).length) acc.push([k, v1]);
      } else {
        if (valueFilter([k, v])) acc.push([k, v]);
      }
      return acc;
    }, [])
  );
}

function extractKey(e: [string, unknown]) {
  return e[0];
}

export function sortKeys<V, T extends Record<string, V>>(
  obj: T,
  comparator: Comparator<string> = Comparators.natural
): T {
  return Object.fromEntries(Object.entries(obj).sort(Comparators.onResultOf(comparator, extractKey))) as T;
}

export function deepSortKeys(obj: unknown, comparator: Comparator<string> = Comparators.natural): unknown {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(e => deepSortKeys(e, comparator));
  if (typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [k, deepSortKeys(v)] as [string, unknown])
      .sort(Comparators.onResultOf(comparator, extractKey))
  );
}
