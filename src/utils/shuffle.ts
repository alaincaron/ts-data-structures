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
  const { left, right, f: random } = parseArgs(arr.length, arg2, arg3, arg4, Math.random);
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

declare global {
  // eslint-disable-next-line
  interface Array<T> {
    shuffle(
      arg2?: number | Mapper<void, number>,
      arg3?: number | Mapper<void, number>,
      mapper?: Mapper<void, number>
    ): T[];
  }
}

Array.prototype.shuffle = function (
  arg2?: number | Mapper<void, number>,
  arg3?: number | Mapper<void, number>,
  arg4?: Mapper<void, number>
) {
  return shuffle(this, arg2 as number, arg3 as number, arg4 as Mapper<void, number>);
};
