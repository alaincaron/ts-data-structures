import { Comparator, Comparators } from 'ts-fluent-iterators';

export function bsearch<T>(arr: T[], e: T, compare: Comparator<T> = Comparators.natural): number {
  let m = 0;
  let n = arr.length - 1;
  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = compare(e, arr[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return ~m;
}

export function insertSorted<T>(arr: T[], e: T, compare: Comparator<T> = Comparators.natural): T[] {
  const idx = bsearch(arr, e, compare);
  if (idx >= 0) arr.splice(idx, 0, e);
  else arr.splice(~idx, 0, e);
  return arr;
}
