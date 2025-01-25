export function equalsIterable(x: Iterable<any>, y: Iterable<any>): boolean {
  const iter1 = x[Symbol.iterator]();
  const iter2 = y[Symbol.iterator]();
  for (;;) {
    const item1 = iter1.next();
    const item2 = iter2.next();
    if (item1.done || item2.done) return item1.done === item2.done;
    if (!equalsAny(item1.value, item2.value)) return false;
  }
}

export function equalsAny(x: any, y: any): boolean {
  if (x === y) return true;
  if (typeof x != typeof y) return false;
  if (x == null || y == null) return x === y;
  switch (typeof x) {
    case 'object': {
      if (typeof x.equals === 'function') return x.equals(y);
      if (x.constructor != y.constructor) return false;
      const isIterableX = typeof x[Symbol.iterator] === 'function';
      const isIterableY = typeof y[Symbol.iterator] === 'function';
      if (isIterableX !== isIterableY) return false;
      if (isIterableX) {
        return equalsIterable(x, y);
      }
      const entriesX = Object.entries(x);
      const entriesY = Object.entries(y);
      if (entriesX.length != entriesY.length) return false;
      return equalsIterable(entriesX.sort(), entriesY.sort());
    }
    default:
      return false;
  }
}
