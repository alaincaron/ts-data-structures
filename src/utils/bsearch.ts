export function bsearch<T>(arr: T[], el: T, compare_fn?: (a: T, b: T) => number) {
  compare_fn ??= (a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0);
  let m = 0;
  let n = arr.length - 1;
  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = compare_fn(el, arr[k]);
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
