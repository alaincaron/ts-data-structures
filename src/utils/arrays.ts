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

export function insertionSort<T>(
  arr: T[],
  left: number,
  right: number,
  compare: Comparator<T> = Comparators.natural
): T[] {
  let j: number;
  for (let p = left + 1; p < right; ++p) {
    const tmp = arr[p];
    for (j = p; j > left && compare(tmp, arr[j - 1]) < 0; --j) {
      arr[j] = arr[j - 1];
    }
    arr[j] = tmp;
  }
  return arr;
}

export function insertSorted<T>(arr: T[], e: T, compare: Comparator<T> = Comparators.natural): T[] {
  const idx = bsearch(arr, e, compare);
  if (idx >= 0) arr.splice(idx, 0, e);
  else arr.splice(~idx, 0, e);
  return arr;
}

export function shellSort<T>(arr: T[], left: number, right: number, compare: Comparator<T> = Comparators.natural): T[] {
  let gap = (right - left) >> 1;

  while (gap > 0) {
    for (let i = left + gap; i < right; ++i) {
      const tmp = arr[i];
      let j = i;
      while (j >= left + gap && compare(arr[j - gap], tmp) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = tmp;
    }
    gap >>= 1;
  }
  return arr;
}

export function mergeSort<T>(arr: T[], left: number, right: number, compare: Comparator<T> = Comparators.natural): T[] {
  const n = right - left;
  if (n <= 5) return insertionSort(arr, left, right, compare);
  const tmp = mergeSort0(arr, left, right, compare);
  arr.splice(left, n, ...tmp);
  return arr;
}

function mergeArrays<T>(left: T[], right: T[], compare: Comparator<T>): T[] {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) < 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

function sortArray<T>(arr: T[], compare: Comparator<T>): T[] {
  if (arr.length <= 5) return insertionSort(arr, 0, arr.length, compare);
  return mergeSort0(arr, 0, arr.length, compare);
}

function mergeSort0<T>(arr: T[], left: number, right: number, compare: Comparator<T>): T[] {
  const mid = left + Math.floor((right - left) / 2);

  const leftArray = sortArray(arr.slice(left, mid), compare);
  const rightArray = sortArray(arr.slice(mid, right), compare);
  return mergeArrays(leftArray, rightArray, compare);
}
