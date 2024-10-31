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

export function removeNull<V>(obj: Record<string, V>) {
  return filter(obj, ([_, v]) => v != null);
}

export function removeEmpty<V>(obj: Record<string, V>) {
  return filter(obj, ([_, v]) => v != null && (typeof v != 'string' || !!v));
}

export function filter<V>(obj: Record<string, V>, predicate: Predicate<[string, V]>) {
  return Object.fromEntries(Object.entries(obj).filter(predicate));
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

export function sortKeys<V>(obj: Record<string, V>, comparator: Comparator<string> = Comparators.natural) {
  return Object.fromEntries(Object.entries(obj).sort(Comparators.onResultOf(comparator, extractKey)));
}

export function deepSortKeys(obj: object, comparator: Comparator<string> = Comparators.natural): unknown {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(e => deepSortKeys(e, comparator));
  if (typeof obj !== 'object') return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [k, deepSortKeys(v)] as [string, unknown])
      .sort(Comparators.onResultOf(comparator, extractKey))
  );
}
