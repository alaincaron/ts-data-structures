import { Comparators } from 'ts-fluent-iterators';
import { ArrayList } from '../../src';

export function list<K>(...x: K[]) {
  return ArrayList.create({ initial: x });
}

export const multiMapComparator = (x: [string, unknown], y: [string, unknown]) =>
  Comparators.defaultComparator(x[0], y[0]);
