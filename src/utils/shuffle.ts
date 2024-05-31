import { Mapper } from 'ts-fluent-iterators';
import { parseArgs } from './parse_args';

export function shuffle<E>(arr: E[]): E[];
export function shuffle<E>(arr: E[], arg2?: number | Mapper<void, number>): E[];
export function shuffle<E>(arr: E[], left: number, arg3?: number | Mapper<void, number>): E[];
export function shuffle<E>(arr: E[], left: number, right: number, random?: Mapper<void, number>): E[];

export function shuffle<E>(
  arr: E[],
  arg2?: number | Mapper<void, number>,
  arg3?: number | Mapper<void, number>,
  arg4?: Mapper<void, number>
): E[] {
  const { left, right, f: random } = parseArgs(arr, arg2, arg3, arg4, Math.random);
  return shuffle0(arr, left, right, random);
}

function shuffle0<E>(arr: E[], left: number, right: number, random: Mapper<void, number>) {
  let n = right - left;
  while (n >= 1) {
    const i = right - n;
    const pos = i + Math.floor(random() * (n - i));
    const tmp = arr[i];
    arr[i] = arr[pos];
    arr[pos] = tmp;
    --n;
  }
  return arr;
}

export function toShuffled<E>(arr: E[]): E[];
export function toShuffled<E>(arr: E[], arg2: number | Mapper<void, number>): E[];
export function toShuffled<E>(arr: E[], left: number, arg3: number | Mapper<void, number>): E[];
export function toShuffled<E>(arr: E[], left: number, right: number, random: Mapper<void, number>): E[];

export function toShuffled<E>(
  arr: E[],
  arg2?: number | Mapper<void, number>,
  arg3?: number | Mapper<void, number>,
  arg4?: Mapper<void, number>
): E[] {
  const { left, right, f: random } = parseArgs(arr, arg2, arg3, arg4, Math.random);
  const result = arr.slice(left, right);
  return shuffle0(result, 0, result.length, random);
}
